import SourceDocumentView from './SourceDocumentView';
import SuspiciousDocumentView from './SuspiciousDocumentView';
import Tooltip from '../../components/Tooltip';

const CompareView = ({
  docType,
  susDoc,
  caseNum,
  plagReport,
  sourceFilenum,
  setCaseNum,
}) => {
  return (
    <>
      <Tooltip>
        <ul className="list-disc list-inside">
          <li className="mt-1">
            <strong className="text-blue-600">Suspicious document</strong> is
            placed on the left and{' '}
            <strong className="text-blue-600">source document</strong> is placed
            on the right.
          </li>
          <li className="mt-1">
            Four colours are used to indicate different plagiarised parts.
          </li>
          <li className="mt-1">
            <div className="inline-block w-5 h-3 bg-rose-600/[.35] mr-3"></div>
            Indicate the selected plagiarised part.
          </li>
          <li className="mt-1">
            <div className="inline-block w-5 h-3 bg-purple-600 opacity-[.35] mr-3"></div>
            Indicate overlapped parts within the selected plagiarised part.
          </li>
          <li className="mt-1">
            <div className="inline-block w-5 h-3 bg-orange-500/[.35] mr-3"></div>
            Indicate other plagiarised parts.
          </li>
          <li className="mt-1">
            <div className="inline-block w-5 h-3 bg-blue-600/[.35] mr-3"></div>
            Indicate other overlapped plagiarised parts.
          </li>
        </ul>
      </Tooltip>
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
    </>
  );
};

export default CompareView;
