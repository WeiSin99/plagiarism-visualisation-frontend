import SourceDocumentView from './SourceDocumentView';
import SuspiciousDocumentView from './SuspiciousDocumentView';

const CompareView = ({
  susDoc,
  caseNum,
  plagReport,
  sourceDetail,
  setSourceDetail,
}) => {
  return (
    <div className="grid grid-cols-2 gap-12">
      <SuspiciousDocumentView
        filenum={susDoc}
        plagReport={plagReport}
        caseNum={caseNum}
        setSourceDetail={setSourceDetail}
      />
      <SourceDocumentView
        filenum={sourceDetail.filenum}
        allPlagParts={sourceDetail.allPlagParts}
        selectedCase={sourceDetail.selectedCase}
      />
    </div>
  );
};

export default CompareView;
