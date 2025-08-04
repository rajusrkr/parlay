import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  styled,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { CloudUpload, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const marketTypes = [
  {
    value: "binary",
    label: "Binary",
  },
  {
    value: "categorical",
    label: "Categorical",
  },
];

const marketCategories = [
  { value: "SPORTS", label: "Sports" },
  { value: "POLITICS", label: "Politics" },
  { value: "CRYPTO", label: "Crypto" },
];

export default function CreateMarket() {
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [settlement, setSettlement] = useState("");
  const [marketType, setMarketType] = useState("binary");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDateAndTime, setStartDateAndTime] = useState<Dayjs | null>(null);
  const [endDateAndTime, setEndDateAndTime] = useState<Dayjs | null>(null);
  const [marketCategory, setMarketCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFileUploadError, setIsFileUploadError] = useState(false);
  const [isFileUploadSuccess, setIsFileUploadSuccess] = useState(false);
  const [fileUploadError, setFileUploadError] = useState("");
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState("");
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      if (!isFileUploadSuccess) {
        setIsError(true);
        setErrorMessage("Thumbnail is require");
        return;
      }

      setLoading(true);
      setIsError(false);
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
            marketType,
            marketCategory,
            thumbnailImageUrl,
          }),
        }
      );

      const res = await sendReq.json();

      if (res.success) {
        setLoading(false);
      } else {
        console.log(res);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Thumbnail image upload

  const handleThumbnailImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsFileUploadError(false);

    const file = e.target.files?.[0];
    if (typeof file !== "object") {
      setIsFileUploadError(true);
      setFileUploadError("Please select a valid file");
      return;
    }

    const allowedFileType = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
    ];

    if (allowedFileType.includes(file!.type)) {
      setIsFileUploading(true);

      const formData = new FormData();
      formData.append("file", file!);

      try {
        const sendReq = await fetch(
          "http://localhost:8000/api/v0/admin/thumbnail-upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const res = await sendReq.json();
        if (res.success) {
          setIsFileUploadSuccess(true);
          setThumbnailImageUrl(res.fileUrl);
          setIsFileUploading(false);
        } else {
          setIsFileUploadError(true);
          setFileUploadError(res.message);
          setIsFileUploading(false);
        }
      } catch (error) {
        console.log(error);
        setIsFileUploadError(true);
        setFileUploadError("Client error occured");
        setIsFileUploading(false);
      }
    } else {
      setIsFileUploadError(true);
      setFileUploadError("File type is not allowed");
      return;
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
          <div className="space-y-10">
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
          <div className="w-full space-y-8 mt-3">
            <div>
              {isFileUploadSuccess ? (
                <div>
                  <p className="font-semibold">Thumbnail:</p>
                  <img
                    src={thumbnailImageUrl}
                    alt="Thumbnail Image"
                    height={100}
                    width={100}
                    className="rounded-md"
                  />
                  <button
                    className="text-xs text-red-500 hover:cursor-pointer hover:underline flex mt-1"
                    onClick={() => {
                      setThumbnailImageUrl("");
                      setIsFileUploadSuccess(false);
                    }}
                  >
                    Delete <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-2">
                    <label htmlFor="market category">
                      Upload a Thumbnail Image
                    </label>
                  </div>
                  <Button
                    component="label"
                    disabled={isFileUploading}
                    role={undefined}
                    color={isFileUploadError ? "error" : "primary"}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={
                      isFileUploading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <CloudUpload />
                      )
                    }
                  >
                    {isFileUploading ? "Uplaoding..." : "Upload Thumbnail"}
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleThumbnailImageUpload}
                    />
                  </Button>

                  <div>
                    {isFileUploadError && (
                      <p className="text-sm text-red-500">{fileUploadError}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="mb-2">
                <label htmlFor="market category">Select market category</label>
              </div>
              <TextField
                select
                label="Market Category"
                helperText="Select market category"
                value={marketCategory}
                onChange={(e) => setMarketCategory(e.target.value)}
                required
                className="w-44"
              >
                {marketCategories.map((ctgry) => (
                  <MenuItem key={ctgry.value} value={ctgry.value}>
                    {ctgry.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div className="mb-2">
              <label htmlFor="market type">Select market type</label>
            </div>
            <TextField
              select
              label="Market Type"
              helperText="Select market type"
              value={marketType}
              required
              onChange={(e) => setMarketType(e.target.value)}
            >
              {marketTypes.map((mrkt) => (
                <MenuItem key={mrkt.value} value={mrkt.value}>
                  {mrkt.label}
                </MenuItem>
              ))}
            </TextField>

            <div>
              <div>
                {marketType === "binary" && (
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
                {marketType === "categorical" && (
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
          <Button
            type="submit"
            disabled={loading}
            size="large"
            variant="contained"
            className="w-56"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create new market"
            )}
          </Button>
          <div>{isError && <p className="text-red-500">{errorMessage}</p>}</div>
        </div>
      </div>
    </form>
  );
}
