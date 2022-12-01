import { useState } from "react";
import Select from "./Select";
const options = [
  { label: "First", value: "1" },
  { label: "Second", value: "2" },
  { label: "third", value: "3" },
  { label: "fourth", value: "4" },
  { label: "Five", value: "5" },
];
interface selectoption {
  label: string;
  value: string | number;
}

function App() {
  const [values, setvalues] = useState<selectoption | undefined>(options[0]);
  const [values1, setvalues1] = useState<selectoption[]>([options[0]]);

  return (
    <>
      <Select option={options} value={values} onChange={(o) => setvalues(o)} />
      <br />
      <Select
        multiple={true}
        option={options}
        value={values1}
        onChange={(o) => setvalues1(o)}
      />
    </>
  );
}

export default App;
