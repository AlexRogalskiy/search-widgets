import { ContextProviderValues, Input, Pipeline, SearchProvider, Variables } from '@sajari/react-search-ui';
import { render } from 'preact/compat';
import { useMemo } from 'react';

import { getPresetSelector, shopifyFieldMapping } from './defaults';
import { EmotionCache } from './emotion-cache';
import TokenCheckBlank from './interface/TokenCheckBlank';
import { SearchInputBindingProps } from './types';
import { getPipelineInfo } from './utils';
import { getTracking } from './utils/getTracking';

const attributesToBeRemoved = [
  'data-predictive-search-drawer-input',
  'role',
  'aria-autocomplete',
  'aria-owns',
  'aria-expanded',
  'aria-label',
  'aria-haspopup',
];

const removeAttributes = (element: Element | null) =>
  attributesToBeRemoved.forEach((attr) => element?.removeAttribute(attr));

const removeThemeElements = (selectorsParam: string | string[]) => {
  const selectors = typeof selectorsParam === 'string' ? selectorsParam.split(' ') : selectorsParam;
  selectors.forEach((selector) => {
    const list = document.querySelectorAll(selector);
    list.forEach((element) => element.remove());
  });
};

const onSelectHandler = (
  element: Element,
  { mode, redirect: { url: pathname, queryParamName } }: Required<Pick<SearchInputBindingProps, 'mode' | 'redirect'>>,
) => {
  const form = element.closest('form');
  if (form) {
    element.setAttribute('name', queryParamName);
    form.setAttribute('action', pathname);
    form.setAttribute('method', 'get');
  }

  return (item: unknown) => {
    // if no wrapped form element found, use JS to programmatically change url path
    if (!form && mode !== 'results') {
      const url = new URL(window.location.href);
      url.searchParams.set(queryParamName, item as string);
      url.pathname = pathname;
      window.location.href = url.href;
      return;
    }
    // otherwise we rely on form element to make the request
    form?.submit();
  };
};

const Wrapper = ({
  children,
  searchContext,
  ...props
}: Pick<SearchInputBindingProps, 'theme' | 'defaultFilter' | 'currency' | 'customClassNames'> & {
  children: React.ReactNode;
  searchContext: ContextProviderValues['search'];
}) => {
  const { theme, defaultFilter, currency, customClassNames } = props;
  return (
    <SearchProvider
      search={searchContext}
      theme={theme}
      searchOnLoad={false}
      defaultFilter={defaultFilter}
      currency={currency}
      customClassNames={customClassNames}
    >
      {children}
    </SearchProvider>
  );
};

const renderBindingInput = (
  targets: NodeListOf<HTMLElement>,
  searchContext: ContextProviderValues['search'],
  params: Omit<SearchInputBindingProps, 'selector' | 'omittedElementSelectors'>,
) => {
  const { mode = 'suggestions', container, options, ...props } = params;

  const redirect = {
    url: props.preset === 'shopify' ? '/search' : '', // Shopify always use /search for search results page
    queryParamName: 'q',
    ...props.redirect,
  };

  targets.forEach((target) => {
    const showPoweredBy = options?.showPoweredBy ?? props.preset !== 'shopify';

    if (target instanceof HTMLInputElement) {
      const fragment = document.createDocumentFragment();

      removeAttributes(target);

      render(
        <Wrapper searchContext={searchContext} {...props}>
          <EmotionCache cacheKey={mode} container={container}>
            <Input
              {...options}
              portalContainer={container}
              mode={mode}
              onSelect={onSelectHandler(target, { mode, redirect })}
              inputElement={{ current: target }}
              showPoweredBy={showPoweredBy}
            />
          </EmotionCache>
        </Wrapper>,
        fragment as unknown as Element,
      );
    } else {
      target.childNodes.forEach((node) => {
        if (!(node instanceof Element) || node.tagName !== 'INPUT') {
          return;
        }

        const element = node as HTMLInputElement;
        const fragment = document.createDocumentFragment();

        removeAttributes(element);

        render(
          <Wrapper searchContext={searchContext} {...props}>
            <EmotionCache cacheKey={mode} container={container}>
              <Input
                {...options}
                portalContainer={container}
                mode={mode}
                onSelect={onSelectHandler(element, { mode, redirect })}
                inputElement={{ current: element }}
                showPoweredBy={showPoweredBy}
              />
            </EmotionCache>
          </Wrapper>,
          fragment as unknown as Element,
        );
      });
    }
  });
};

export default ({ selector: selectorProp, omittedElementSelectors, ...rest }: SearchInputBindingProps) => {
  let targets: NodeListOf<HTMLElement> | null = null;
  let selector = selectorProp;
  if (!selectorProp) {
    selector = getPresetSelector(rest.preset);
  }
  targets = document.querySelectorAll(selector);

  const tracking = getTracking(rest);
  const searchContext = useMemo(() => {
    const { variables: variablesProp, account, collection, endpoint, clickTokenURL, pipeline, config, fields } = rest;
    const { name, version = undefined } = getPipelineInfo(pipeline);
    const variables = new Variables({ ...variablesProp });

    return {
      pipeline: new Pipeline(
        {
          account,
          collection,
          endpoint,
          clickTokenURL,
        },
        { name, version },
        tracking,
      ),
      config,
      variables,
      fields: rest.preset === 'shopify' ? { ...shopifyFieldMapping, ...fields } : fields,
    };
  }, []);

  if (targets && targets.length > 0) {
    if (omittedElementSelectors) {
      removeThemeElements(omittedElementSelectors);
    }
    renderBindingInput(targets, searchContext, rest);
  }
  return (
    <SearchProvider search={searchContext}>
      <TokenCheckBlank />
    </SearchProvider>
  );
};
