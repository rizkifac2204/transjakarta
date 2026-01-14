import Alert from "@/components/ui/Alert";
import JawabanCard from "./_JawabanCard";

function JawabanList({ data, section, foreignKey }) {
  if (!Boolean(data.length))
    return (
      <Alert
        label="Jawaban/Response Tidak Ditemukan"
        className="alert-info text-black-500"
      />
    );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((item) => (
          <JawabanCard
            key={item.id}
            item={item}
            section={section}
            foreignKey={foreignKey}
          />
        ))}
      </div>
    </>
  );
}

export default JawabanList;
