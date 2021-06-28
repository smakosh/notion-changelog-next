import { Block } from '@notionhq/client/build/src/api-types';

// @TODO: export these components
const renderBlocks = (blocks: Block[]) => {
  const list = blocks.filter((item) => item.type === 'bulleted_list_item');
  const otherBlocks = blocks.filter(
    (item) =>
      item.type !== 'bulleted_list_item' && item.type !== 'numbered_list_item'
  );

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'heading_1':
        return (
          <h1 className="text-2xl mt-3 mb-2 font-bold" key={block.id}>
            {block.heading_1.text[0].plain_text}
          </h1>
        );
      case 'heading_2':
        return (
          <h2 className="text-xl mt-3 mb-2 font-semibold" key={block.id}>
            {block.heading_2.text[0].plain_text}
          </h2>
        );
      case 'heading_3':
        return (
          <h3 className="text-lg mt-3 mb-2 font-medium" key={block.id}>
            {block.heading_3.text[0].plain_text}
          </h3>
        );
      case 'paragraph':
        return (
          <p className="text-base mb-2 text-gray-900" key={block.id}>
            {block.paragraph.text[0].plain_text}
          </p>
        );
      case 'bulleted_list_item':
        return (
          <li key={block.id}>{block.bulleted_list_item.text[0].plain_text}</li>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {otherBlocks.map((item) => renderBlock(item))}
      <ul className="list-disc">{list.map((item) => renderBlock(item))}</ul>
    </>
  );
};

export default renderBlocks;
