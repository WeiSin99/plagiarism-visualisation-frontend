import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Homepage from './pages/Homepage/Homepage';
import Corpus from './pages/Corpora/Corpus';
import Document from './pages/Documents/Document';
import DetailAnalysis from './pages/DetailAnalysis/DetailAnalysis';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="corpus/:id" element={<Corpus />} />
        <Route path="document/:id" element={<DetailAnalysis />} />
        <Route path="source-retrieval/:id" element={<Document />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
