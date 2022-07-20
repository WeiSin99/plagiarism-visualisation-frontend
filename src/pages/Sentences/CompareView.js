const CompareView = ({ plagCase }) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="col-span-1">
        <section>
          <p className="text-2xl font-semibold mb-2">
            Potential Plagiarised Sentence
          </p>
          <p className="prose prose-slate prose-md">{plagCase.sentence}</p>
        </section>
      </div>
      <div className="col-span-1">
        <section>
          <p className="text-2xl font-semibold mb-2">Potential Source</p>
          {plagCase.source.map((source, idx) => (
            <p key={idx} className="prose prose-slate prose-md mb-3">
              {source.sentence}
            </p>
          ))}
        </section>
      </div>
    </div>
  );
};

export default CompareView;
