import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="flex flex-col h-full content-center">
      <div className="bg-white pb-8 sm:pb-12 lg:pb-12 my-auto">
        <div className="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-48">
          <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-[90rem] lg:grid lg:grid-cols-2 lg:gap-24">
            <div className="sm:max-w-xl">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl sm:tracking-tight">
                Visualisation tool for plagiarism detection
              </h1>
              <p className="mt-6 text-xl text-gray-500">
                This is a tool that aims to simplify the plagiarism detection
                process by using automatic plagiarism detection and introducing
                several visualisation methods. Tooltips are provided at the top
                right corner of each visualisation to help users better
                understanding it.
              </p>
              <p className="mt-2 text-xl text-gray-500">
                It has been evaluated on the{' '}
                <a
                  className="text-blue-500 hover:text-blue-600"
                  href="https://doi.org/10.5281/zenodo.3250095"
                  target="_blank"
                  rel="noreferrer"
                >
                  PAN-PC-11
                </a>{' '}
                dataset and ten corpora (collection of documents) has been
                created from a subset of the dataset to demonstrate this tool.
                Select one of the corpus from the list below to get started.
              </p>
              <div className="mt-8">
                {[...Array(10).keys()].map(num => (
                  <Link
                    key={num + 1}
                    className="text-center inline-flex min-w-[98px] mr-5 mb-5 py-4 px-3 items-center rounded-md bg-blue-500 text-base font-medium leading-4 text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    to={`/corpus/${num + 1}`}
                  >
                    {`Corpus ${num + 1}`}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
            <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <div className="hidden sm:block">
                <div className="absolute inset-y-0 left-1/2 w-screen bg-gray-50 rounded-l-3xl lg:left-80 lg:right-0 lg:w-full" />
                <svg
                  className="absolute top-8 right-1/2 -mr-3 lg:m-0 lg:left-0"
                  width={404}
                  height={392}
                  fill="none"
                  viewBox="0 0 404 392"
                >
                  <defs>
                    <pattern
                      id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                      x={0}
                      y={0}
                      width={20}
                      height={20}
                      patternUnits="userSpaceOnUse"
                    >
                      <rect
                        x={0}
                        y={0}
                        width={4}
                        height={4}
                        className="text-gray-200"
                        fill="currentColor"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width={404}
                    height={392}
                    fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
                  />
                </svg>
              </div>
              <div className="relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full lg:pl-12">
                <img
                  className="w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
                  src="/document-view.png"
                  alt="Project Screenshot"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
