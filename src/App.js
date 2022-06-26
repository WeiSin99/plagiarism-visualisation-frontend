import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Table from './components/Table';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:id" element={<Table />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
