import { Button } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useState } from "react";

const Home = () => {
  // const [value, setValue] = useState<Dayjs | null>(dayjs());
  // console.log(value);

  const [dateAndTimeValue, setDateTimeValue] = useState<Dayjs | null>(null);
  const ndate = dayjs(dateAndTimeValue).valueOf();

  const formated = dayjs(ndate).format("YYYY-DD-MM HH:mm:ss");
  console.log(formated);
  const color = "#c8d6e8";

  return (
    <div>
      <h4 className="font-bold">Admin FE home</h4>
      <Button
        variant="text"
        color="primary"
        style={{ textTransform: "capitalize", backgroundColor: color }}
      >
        Hello there
      </Button>
      {/* <div>
        <DatePicker
          label="Select date"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </div> */}

      <div className="pt-20">
        <DateTimePicker
          label="Select date and time"
          value={dateAndTimeValue}
          onChange={setDateTimeValue}
        />
      </div>
    </div>
  );
};

export default Home;
