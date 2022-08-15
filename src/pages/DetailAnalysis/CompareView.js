import SourceDocumentView from './SourceDocumentView';
import SuspiciousDocumentView from './SuspiciousDocumentView';

const CompareView = ({
  susDoc,
  caseNum,
  plagReport,
  sourceFilenum,
  setCaseNum,
}) => {
  return (
    <div className="grid grid-cols-2 gap-12 mt-10">
      <SuspiciousDocumentView
        filenum={susDoc}
        plagReport={plagReport}
        caseNum={caseNum}
        setCaseNum={setCaseNum}
      />
      <SourceDocumentView
        filenum={sourceFilenum}
        plagReport={plagReport}
        caseNum={caseNum}
      />
    </div>
  );
};

export default CompareView;
