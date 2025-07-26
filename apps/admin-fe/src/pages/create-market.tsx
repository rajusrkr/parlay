import { Button, Chip, MenuItem, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useState } from "react";

const marketType = [
  {
    value: "binary",
    label: "Binary",
  },
  {
    value: "categorical",
    label: "Categorical",
  },
];

export default function CreateMarket() {
  const [title, setTitle] = useState("");
  console.log(title);
  const [overview, setOverview] = useState("");
  console.log(overview);
  const [settlement, setSettlement] = useState("");
  console.log(settlement);
  const [marketCategory, setMarketCategory] = useState("");
  console.log(marketCategory);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        console.log(title, overview, settlement);
      }}
    >
      <div className="px-10">
        <div className="py-5">
          <Chip
            label="Create new market"
            variant="outlined"
            style={{
              fontSize: "26px",
              backgroundColor: "black",
              color: "white",
            }}
          />
        </div>
        <div className="flex max-w-6xl mx-auto space-x-5">
          <div className="space-y-8">
            <div>
              <TextField
                multiline
                label="Market Title"
                fullWidth
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <TextField
                multiline
                label="Overview"
                fullWidth
                onChange={(e) => setOverview(e.target.value)}
                required
              />
            </div>
            <div>
              <TextField
                multiline
                label="Settlement"
                fullWidth
                onChange={(e) => setSettlement(e.target.value)}
                required
              />
            </div>
            <div className="flex space-x-5">
              <div>
                <DateTimePicker label="Select Start Time" />
              </div>
              <div>
                <DateTimePicker label="Select End Time" />
              </div>
            </div>
          </div>
          <div className="w-full">
            <TextField
              select
              label="Market Type"
              helperText="Please select market category"
              defaultValue={"binary"}
              required
              onChange={(e) => setMarketCategory(e.target.value)}
            >
              {marketType.map((mrkt) => (
                <MenuItem key={mrkt.value} value={mrkt.value}>
                  {mrkt.label}
                </MenuItem>
              ))}
            </TextField>

            <div>
              {marketCategory === "binary" && (
                <div className="bg-blue-50 w-52 rounded py-2">
                  <div className="px-4">
                    <p className="font-semibold underline underline-offset-4">Options:</p>

                    <div className="space-y-1">
                      <p className="bg-blue-100 pl-1">Yes</p>
                      <p className="bg-blue-100 pl-1">No</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
