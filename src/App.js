import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Corpus from './pages/Corpora/Corpus';
import Document from './pages/Documents/Document';
import Sentence from './pages/Sentences/Sentence';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="corpus/:id" element={<Corpus />} />
        <Route path="document/:id" element={<Sentence />} />
        <Route path="source-retrieval/:id" element={<Document />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
