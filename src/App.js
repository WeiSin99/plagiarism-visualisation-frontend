import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Homepage from './pages/Homepage/Homepage';
import Corpus from './pages/Corpora/Corpus';
import Document from './pages/Documents/Document';
import DetailAnalysis from './pages/DetailAnalysis/DetailAnalysis';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Homepage />} />
        <Route path="corpus/:id" element={<Corpus />} />
        <Route path="document/:id" element={<DetailAnalysis />} />
        <Route path="source-retrieval/:id" element={<Document />} /> */}
        <Route
          path="/"
          element={
            <div className="flex h-full w-full text-center">
              <h1 className="text-5xl font-semibold self-center w-full">
                Site brought down after project ended.
              </h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
