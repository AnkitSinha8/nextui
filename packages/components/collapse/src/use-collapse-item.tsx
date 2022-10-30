import type {CollapseItemBaseProps} from "./base/collapse-item-base";

import {useFocusRing} from "@react-aria/focus";
import {TreeState} from "@react-stately/tree";
import {callAllHandlers, ReactRef} from "@nextui-org/shared-utils";
import {useAccordionItem, NodeWithProps} from "@nextui-org/aria-utils";
import {useDOMRef} from "@nextui-org/dom-utils";
import {Key} from "react";

import CollapseIcon from "./collapse-icon";

export interface UseCollapseItemProps<T extends object> extends CollapseItemBaseProps<T> {
  /**
   * The collapse item ref.
   */
  ref?: ReactRef<HTMLButtonElement | null>;
  /**
   * The current collapse focused key.
   * @internal
   * @info This prop is necessary for the focus to work properly.
   * Due to the fact that the selectionManager focusedKey is no a state.
   */
  focusedKey?: Key | null;
  /**
   * The item node.
   */
  item: NodeWithProps<T, CollapseItemBaseProps<T>>;
  /**
   * The tree state.
   */
  state: TreeState<T>;
  /**
   * Whether the collapse item is disabled.
   * @default false
   */
  isDisabled?: boolean;
}

export function useCollapseItem<T extends object>(props: UseCollapseItemProps<T>) {
  const {item, ...propsWithoutItem} = props;

  const {
    ref,
    css = item.props?.css ?? {},
    as = item.props?.as,
    state,
    focusedKey,
    subtitle = item.props?.subtitle,
    indicator = item.props?.indicator ?? <CollapseIcon />,
    variant = item.props?.variant ?? "default",
    withDivider = item.props?.withDivider ?? true,
    borderWeight = item.props?.borderWeight ?? "normal",
    dividerWeight = item.props?.dividerWeight ?? "light",
    disableAnimation = item.props?.disableAnimation ?? false,
    bgColor = item.props?.bgColor,
    isDisabled: groupDisabled = false,
    onFocusChange,
    ...otherProps
  } = propsWithoutItem;

  const domRef = useDOMRef(ref);

  const {buttonProps, regionProps} = useAccordionItem({item}, {...state, focusedKey}, domRef);
  const {isFocusVisible, focusProps} = useFocusRing({
    autoFocus: item.props?.autoFocus,
  });

  const isDisabled = state.disabledKeys.has(item.key) || groupDisabled;
  const isOpen = state.selectionManager.isSelected(item.key);

  const handleFocus = () => {
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    onFocusChange?.(false);
  };

  return {
    as,
    domRef,
    item,
    css,
    borderWeight,
    dividerWeight,
    bgColor,
    indicator,
    subtitle,
    variant,
    isDisabled,
    isOpen,
    isFocusVisible,
    withDivider,
    disableAnimation,
    buttonProps,
    regionProps,
    focusProps,
    onFocus: callAllHandlers(
      handleFocus,
      focusProps.onFocus,
      otherProps.onFocus,
      item.props?.onFocus,
    ),
    onBlur: callAllHandlers(handleBlur, focusProps.onBlur, otherProps.onBlur, item.props?.onBlur),
    ...otherProps,
  };
}

export type UseCollapseItemReturn = ReturnType<typeof useCollapseItem>;
