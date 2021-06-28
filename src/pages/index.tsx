import { GetStaticProps } from 'next';
import Link from 'next/link';
import { Client } from '@notionhq/client';

type HomeProps = {
  data: {
    results: {
      id: string;
      properties: {
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
    }[];
  };
};

const Home = ({ data }: HomeProps) => (
  <div className="container mx-auto pt-20">
    <h1 className="text-4xl font-semibold mb-14">The Changelog</h1>
    <ul>
      {data.results.map(({ id, properties }, i) => (
        <li key={id}>
          <Link href={`/changelog/${id}`}>
            <a>
              <h2 className="text-black font-bold text-xl mb-4">
                {properties.Title.title[0].plain_text}
              </h2>
            </a>
          </Link>
          <div className="flex items-center mb-4">
            {properties.Tags.multi_select.map(({ color, name }, index) => (
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
          <i>{properties.Date.date.start}</i>
          {i + 1 < data.results.length && (
            <div className="w-2/4 h-0.5 bg-gray-400 my-6" />
          )}
        </li>
      ))}
    </ul>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const notion = new Client({ auth: process.env.NOTION_KEY });
  if (!process.env.NOTION_DATABASE_ID) {
    console.log('Notion Database ID is required');
    return {
      notFound: true,
    };
  }

  const data = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  return {
    props: {
      data,
    },
    revalidate: 5,
  };
};

export default Home;
