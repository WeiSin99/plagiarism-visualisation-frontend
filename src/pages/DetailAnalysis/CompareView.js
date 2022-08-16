import SourceDocumentView from './SourceDocumentView';
import SuspiciousDocumentView from './SuspiciousDocumentView';

const CompareView = ({
  docType,
  susDoc,
  caseNum,
  plagReport,
  sourceFilenum,
  setCaseNum,
}) => {
  return (
    <div className="grid grid-cols-2 gap-12 mt-10">
      <SuspiciousDocumentView
        docType={docType}
        filenum={susDoc}
        plagReport={plagReport}
        caseNum={caseNum}
        setCaseNum={setCaseNum}
      />
      <SourceDocumentView
        docType={docType}
        filenum={sourceFilenum}
        plagReport={plagReport}
        caseNum={caseNum}
      />
    </div>
  );
};

export default CompareView;
