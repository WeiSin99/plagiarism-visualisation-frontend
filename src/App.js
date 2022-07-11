import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Report from './components/Report';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:id" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
