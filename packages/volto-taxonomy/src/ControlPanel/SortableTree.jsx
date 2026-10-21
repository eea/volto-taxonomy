import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import cx from 'classnames';
import { defineMessages, useIntl } from 'react-intl';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import dragSVG from '@plone/volto/icons/drag.svg';
import downSVG from '@plone/volto/icons/down-key.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';
import {
  flattenTree,
  getProjection,
  moveItem,
  removeChildrenOf,
  toggleExpandedAtPath,
} from './treeUtils';

const messages = defineMessages({
  drag: {
    id: 'Drag to reorder',
    defaultMessage: 'Drag to reorder',
  },
  expand: {
    id: 'Expand',
    defaultMessage: 'Expand',
  },
  collapse: {
    id: 'Collapse',
    defaultMessage: 'Collapse',
  },
});

const TreeRow = React.forwardRef(
  (
    {
      item,
      depth,
      indentationWidth,
      renderNode,
      onToggle,
      handleProps,
      style,
      wrapperRef,
      ghost,
      clone,
    },
    ref,
  ) => {
    const intl = useIntl();
    const { node, path } = item;
    const hasChildren = !!node.children?.length;
    const { title, subtitle, buttons } = clone
      ? {}
      : renderNode({ node, path, depth });

    return (
      <li
        className={cx('taxonomy-tree-node', { ghost, clone })}
        ref={wrapperRef}
        style={{ paddingLeft: clone ? 0 : `${indentationWidth * depth}px` }}
      >
        <div className="taxonomy-tree-row" ref={ref} style={style}>
          <button
            type="button"
            className="taxonomy-tree-handle"
            aria-label={intl.formatMessage(messages.drag)}
            {...handleProps}
          >
            <Icon name={dragSVG} size="20px" />
          </button>
          <span className="taxonomy-tree-toggle">
            {hasChildren && !clone && (
              <button
                type="button"
                aria-expanded={node.expanded === true}
                aria-label={intl.formatMessage(
                  node.expanded ? messages.collapse : messages.expand,
                )}
                onClick={() => onToggle(path)}
              >
                <Icon name={node.expanded ? downSVG : rightSVG} size="20px" />
              </button>
            )}
          </span>
          {clone ? (
            <span className="taxonomy-tree-content">
              {node.title || node.key}
            </span>
          ) : (
            <>
              <span className="taxonomy-tree-content">
                <span className="taxonomy-tree-title">{title}</span>
                <span className="taxonomy-tree-subtitle">{subtitle}</span>
              </span>
              <span className="taxonomy-tree-toolbar">{buttons}</span>
            </>
          )}
        </div>
      </li>
    );
  },
);

const animateLayoutChanges = ({ isSorting, wasDragging }) =>
  isSorting || wasDragging ? false : true;

const SortableRow = injectLazyLibs(['dndKitSortable', 'dndKitUtilities'])(({
  id,
  dndKitSortable,
  dndKitUtilities,
  ...props
}) => {
  const { useSortable } = dndKitSortable;
  const { CSS } = dndKitUtilities;
  const {
    attributes,
    isDragging,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({ id, animateLayoutChanges });

  return (
    <TreeRow
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      ghost={isDragging}
      handleProps={{ ...attributes, ...listeners }}
      {...props}
    />
  );
});

/**
 * Nested sortable tree built on dnd-kit. Rows are dragged by their handle;
 * dragging horizontally changes the nesting level.
 */
export const SortableTree = ({
  treeData = [],
  onChange,
  renderNode,
  className,
  indentationWidth = 44,
  dndKitCore,
  dndKitSortable,
}) => {
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const {
    DndContext,
    closestCenter,
    DragOverlay,
    MeasuringStrategy,
    PointerSensor,
    useSensor,
    useSensors,
  } = dndKitCore;
  const { SortableContext, arrayMove, verticalListSortingStrategy } =
    dndKitSortable;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const flattenedItems = useMemo(
    () => removeChildrenOf(flattenTree(treeData), activeId ? [activeId] : []),
    [treeData, activeId],
  );
  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems],
  );
  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;
  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth,
          arrayMove,
        )
      : null;

  const resetState = () => {
    setActiveId(null);
    setOverId(null);
    setOffsetLeft(0);
    document.body.style.setProperty('cursor', '');
  };

  const onToggle = (path) => onChange(toggleExpandedAtPath(treeData, path));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={({ active }) => {
        setActiveId(active.id);
        setOverId(active.id);
        document.body.style.setProperty('cursor', 'grabbing');
      }}
      onDragMove={({ delta }) => setOffsetLeft(delta.x)}
      onDragOver={({ over }) => setOverId(over?.id ?? null)}
      onDragEnd={({ active, over }) => {
        if (projected && over) {
          onChange(
            moveItem(treeData, active.id, over.id, projected, arrayMove),
          );
        }
        resetState();
      }}
      onDragCancel={resetState}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        <ul className={cx('taxonomy-tree', className)}>
          {flattenedItems.map((item) => (
            <SortableRow
              key={item.id}
              id={item.id}
              item={item}
              depth={
                item.id === activeId && projected ? projected.depth : item.depth
              }
              indentationWidth={indentationWidth}
              renderNode={renderNode}
              onToggle={onToggle}
            />
          ))}
        </ul>
        {typeof document !== 'undefined' &&
          createPortal(
            <DragOverlay>
              {activeItem ? (
                <ul className={cx('taxonomy-tree', className)}>
                  <TreeRow
                    item={activeItem}
                    depth={activeItem.depth}
                    indentationWidth={indentationWidth}
                    clone
                  />
                </ul>
              ) : null}
            </DragOverlay>,
            document.body,
          )}
      </SortableContext>
    </DndContext>
  );
};

export default injectLazyLibs(['dndKitCore', 'dndKitSortable'])(SortableTree);
