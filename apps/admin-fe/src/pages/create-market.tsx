import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
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
  const [overview, setOverview] = useState("");
  const [settlement, setSettlement] = useState("");
  const [marketCategory, setMarketCategory] = useState("binary");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDateAndTime, setStartDateAndTime] = useState<Dayjs | null>(null);
  const [endDateAndTime, setEndDateAndTime] = useState<Dayjs | null>(null);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Form submit
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formatedStartDateAndTime = dayjs(startDateAndTime).valueOf();
    const formatedEndtDateAndTime = dayjs(endDateAndTime).valueOf();

    // validate forms -> Will do later

    // go for db insertion

    try {
      const sendReq = await fetch(
        "http://localhost:8000/api/v0/admin/create-market",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title,
            overview,
            settlement,
            marketStarts: formatedStartDateAndTime,
            marketEnds: formatedEndtDateAndTime,
            marketType: marketCategory,
          }),
        }
      );

      const res = await sendReq.json();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
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
              <div className="mb-2">
                <label htmlFor="overciew">Market Title</label>
              </div>
              <TextField
                multiline
                label="Market Title"
                fullWidth
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2">
                <label htmlFor="overciew">Market Overview</label>
              </div>
              <TextField
                multiline
                label="Overview"
                fullWidth
                onChange={(e) => setOverview(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2">
                <label htmlFor="overciew">Market Settlement</label>
              </div>
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
                <div className="mb-2">
                <label htmlFor="overciew">Market Starts</label>
              </div>
                <DateTimePicker
                  label="Select Start Time"
                  onChange={setStartDateAndTime}
                />
              </div>
              <div>
                <div className="mb-2">
                <label htmlFor="overciew">Market Ends</label>
              </div>
                <DateTimePicker
                  label="Select End Time"
                  onChange={setEndDateAndTime}
                />
              </div>
            </div>
          </div>
          <div className="w-full">
            <TextField
              select
              label="Market Type"
              helperText="Please select market category"
              value={marketCategory}
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
              <div>
                {marketCategory === "binary" && (
                  <div className="bg-blue-50 w-52 rounded py-2">
                    <div className="px-4">
                      <p className="font-semibold underline underline-offset-4">
                        Options:
                      </p>

                      <div className="space-y-1">
                        <p className="bg-blue-100 pl-1">Yes</p>
                        <p className="bg-blue-100 pl-1">No</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                {marketCategory === "categorical" && (
                  <div className="bg-blue-50 w-52 rounded py-2">
                    <div className="px-4">
                      <p className="font-semibold underline underline-offset-4">
                        Options:
                      </p>

                      <div className="space-y-1">
                        <p className="bg-blue-100 pl-1">Yes</p>
                        <p className="bg-blue-100 pl-1">No</p>
                      </div>
                      <div>
                        <Button onClick={handleDialogOpen}>Add Options</Button>

                        <Dialog
                          open={dialogOpen}
                          onClose={handleDialogClose}
                          aria-labelledby="add-options-dialog"
                        >
                          <DialogTitle id="add-option-dialog-title">
                            {"Add Options below"}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText sx={{ marginBottom: 1 }}>
                              Type options
                            </DialogContentText>
                            <TextField
                              autoFocus
                              label="Add option"
                              type="text"
                              size="small"
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button color="error" onClick={handleDialogClose}>
                              Close
                            </Button>
                            <Button onClick={handleDialogClose}>Add</Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto py-5">
          <Button type="submit" size="large" variant="contained">
            Create new market
          </Button>
        </div>
      </div>
    </form>
  );
}
