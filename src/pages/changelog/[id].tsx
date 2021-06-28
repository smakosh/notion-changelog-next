import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Client } from '@notionhq/client';
import renderBlocks from 'utils/renderBlocks';
import { Block } from '@notionhq/client/build/src/api-types';

type ChangelogProps = {
  data: {
    properties: {
      Cover?: {
        files: {
          name: string;
        }[];
      };
      Date: {
        date: {
          start: string;
        };
      };
      Tags: {
        multi_select: {
          id: string;
          color: string;
          name: string;
        }[];
      };
      Title: {
        title: {
          plain_text: string;
        }[];
      };
    };
  };
  blocks: {
    results: Block[];
  };
};

const Changelog = ({ data, blocks }: ChangelogProps) => (
  <div className="container mx-auto pt-20">
    <div className="mb-14">
      <h1 className="text-4xl font-semibold mb-4">
        {data.properties.Title.title[0].plain_text}
      </h1>
      <div className="flex items-center mb-4">
        {data.properties.Tags.multi_select.map(({ color, name }, index) => (
          <div
            key={index}
            className="text-xs px-1 py-1 rounded-3xl text-white w-24 text-center mr-2"
            style={{
              backgroundColor: color,
            }}
          >
            {name}
          </div>
        ))}
      </div>
      <i className="text-gray-500 text-xs">{data.properties.Date.date.start}</i>
      <div>
        <Link href="/">
          <a>Back</a>
        </Link>
      </div>
    </div>
    {data.properties?.Cover?.files![0]?.name && (
      <div className="px-40 py-20">
        <Image
          src={data.properties.Cover.files[0].name}
          alt={data.properties.Title.title[0].plain_text}
          width={1236}
          height={693}
          objectFit="cover"
          layout="responsive"
          placeholder="blur"
          blurDataURL="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
          className="rounded-md"
        />
      </div>
    )}
    <div className="pt-6 pb-20">{renderBlocks(blocks.results)}</div>
  </div>
);

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const notion = new Client({ auth: process.env.NOTION_KEY });
  if (!process.env.NOTION_DATABASE_ID) {
    console.log('Notion Database ID is required');
    return {
      notFound: true,
    };
  }

  const data = await notion.pages.retrieve({
    page_id: String(params!.id),
  });

  const res = await fetch(
    `https://api.notion.com/v1/blocks/${String(
      params!.id
    )}/children?page_size=10`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NOTION_KEY}`,
        'Notion-Version': '2021-05-13',
      },
    }
  );
  const blocks = await res.json();

  return {
    props: {
      data,
      blocks,
    },
    revalidate: 5,
  };
};

export default Changelog;
