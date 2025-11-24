import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import type { Market } from "@repo/types/src";
import { Controller, useForm } from "react-hook-form";
import getDate, { getCoins, marketCategory, type Coin } from "../utils/lib";
import {
  getLocalTimeZone,
  today,
  type CalendarDateTime,
} from "@internationalized/date";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { BACKEND_URI } from "../store/adminStore";

interface Match {
  id: number;
  time: number;
  venue: {
    name: string;
    city: string;
  };
  league: {
    id: number;
    name: string;
    season: number;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
}

export default function MarketCreationForm2() {
  const { register, handleSubmit, watch, control, reset } = useForm<Market>();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [coinSearchVal, setCoinSearchVal] = useState("");
  const formData = watch();
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [outcome, setOutcome] = useState("");
  const [footballMatchDate, setFootBallMatchDate] = useState("");

  const [matches, setMatches] = useState<Match[]>([]);
  const [sliceIndex, setSliceIndex] = useState(0);
  const [sliceEnd, setSliceEnd] = useState(6);
  const [nextBtnClick, setNextBtnClick] = useState(1);

  const totalPageReq = Math.ceil(matches.length / 6);
  console.log(totalPageReq);
  console.log(nextBtnClick);

  const onSubmit = (data: any) => console.log(data);

  return (
    <div className="py-3">
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="py-3"
        size="xl"
        scrollBehavior="normal"
        isDismissable={false}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                {/* Crypto market */}
                {formData.category === "crypto" && (
                  <>
                    <Input
                      type="text"
                      label="Search your crypto"
                      labelPlacement="outside"
                      placeholder="Search..."
                      size="lg"
                      startContent={<Search className="text-default-400" />}
                      variant="underlined"
                      value={coinSearchVal}
                      onChange={(e) => {
                        setCoinSearchVal(e.target.value);
                        const coins = getCoins();
                        const filteredCoin = coins.filter((coin) =>
                          coin.key.includes(e.target.value.toUpperCase())
                        );
                        setFilteredCoins(filteredCoin.slice(0, 6));
                      }}
                    />
                  </>
                )}

                {/* Sports market */}
                {formData.category === "sports" && (
                  <div className="w-full">
                    <p>Search matches by date</p>
                    <div className="flex items-center gap-2">
                      <DatePicker
                        granularity="day"
                        size="lg"
                        variant="faded"
                        maxValue={today(getLocalTimeZone()).add({ days: 1 })}
                        minValue={today(getLocalTimeZone())}
                        onChange={(e) => {
                          const date = `${e?.year}-${e?.month}-${e?.day}`;
                          setFootBallMatchDate(date);
                        }}
                      />
                      <Button
                        size="lg"
                        color="secondary"
                        variant="faded"
                        isDisabled={footballMatchDate.length === 0}
                        onPress={async () => {
                          const data = await fetch(
                            `${BACKEND_URI}/admin/matches/football/?date=${footballMatchDate}`,
                            {
                              credentials: "include",
                            }
                          );
                          const res = await data.json();
                          setMatches(res.matches);
                        }}
                      >
                        Search
                      </Button>
                    </div>
                    <Divider className="my-4" />
                  </div>
                )}
              </ModalHeader>
              <ModalBody className="overflow-y-auto">
                {/* Crypto market */}
                {formData.category === "crypto" && (
                  <>
                    {filteredCoins.length === 0 ? (
                      <p className="font-semibold text-default-500">
                        Search coin and it will apear here
                      </p>
                    ) : (
                      <div>
                        {filteredCoins.map((cn) => (
                          <Controller
                            key={cn.key}
                            name="cryptoCoinName"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <ul className="py-1">
                                <li
                                  className="w-full p-2 text-lg hover:bg-primary-500 bg-default-200 rounded-lg hover:text-default-50 hover:cursor-pointer transition-all"
                                  onClick={() => {
                                    field.onChange(cn.key);
                                    onClose();
                                  }}
                                >
                                  {cn.label}
                                </li>
                              </ul>
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {formData.category === "sports" && (
                  <div>
                    <p className="font-bold text-default-700">{
                      matches.length === 0 ? "Search for matches, will appear here" : "Matches"
                      }</p>
                    {matches.slice(sliceIndex, sliceEnd).map((match, i) => (
                      <div key={i} className="p-2 grid grid-rows-1">
                        <Card radius="sm" className="p-2">
                          <div className="flex">
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">
                                {match.teams.home.name}
                              </span>
                              <span>
                                <Image src={match.teams.home.logo} width={20} />
                              </span>
                              <span className="font-semibold">V/S</span>
                            </div>

                            <div className="flex items-center gap-1 ml-1">
                              <span>
                                <Image src={match.teams.away.logo} width={20} />
                              </span>
                              <span className="font-semibold">
                                {match.teams.away.name}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <p className="font-semibold text-default-600 text-sm">
                              Date and time:{" "}
                              {new Date(match.time * 1000).toLocaleString(
                                "en-US",
                                {
                                  timeZone: "Asia/Kolkata",
                                  dateStyle: "medium",
                                  timeStyle: "medium",
                                }
                              )}
                            </p>
                            <p className="font-semibold text-default-600 text-sm">
                              {`League: ${match.league.name}`}
                            </p>
                          </div>
                        </Card>
                      </div>
                    ))}

                    <div>
                      {matches.length !== 0 && (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            isDisabled={sliceIndex === 0 && sliceEnd === 6}
                            color={
                              sliceIndex === 0 && sliceEnd === 6
                                ? "default"
                                : "secondary"
                            }
                            variant="ghost"
                            size="sm"
                            onPress={() => {
                              setSliceIndex((prev) => prev - 6);
                              setSliceEnd((prev) => prev - 6);
                              setNextBtnClick((prev) => (prev -= 1));
                            }}
                          >
                            <ChevronLeft />
                          </Button>

                          <Button
                            color={
                              totalPageReq === nextBtnClick ||
                              matches.length === 0
                                ? "default"
                                : "secondary"
                            }
                            variant="ghost"
                            size="sm"
                            isDisabled={
                              totalPageReq === nextBtnClick ||
                              matches.length === 0
                            }
                            onPress={() => {
                              setSliceIndex((prev) => prev + 6);
                              setSliceEnd((prev) => prev + 6);
                              setNextBtnClick((prev) => (prev += 1));
                            }}
                          >
                            <ChevronRight />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sports market */}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="justify-between">
          <Chip color="secondary" variant="bordered">
            Add new market
          </Chip>
          <Button
            size="sm"
            variant="light"
            color="secondary"
            onPress={() => {
              reset();
            }}
          >
            Reset
          </Button>
        </CardHeader>

        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {/* Select field */}
            <div className="w-full flex md:flex-row gap-2">
              <div className="w-full">
                <Select
                  size="lg"
                  variant="faded"
                  selectionMode="single"
                  placeholder="Select a market category"
                  label="Market category"
                  labelPlacement="outside"
                  isRequired
                  {...register("category")}
                >
                  {marketCategory.map((mrktctgry) => (
                    <SelectItem key={mrktctgry.key}>
                      {mrktctgry.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <>
                {formData.category === "crypto" && (
                  <div className="w-full">
                    <Input
                      size="lg"
                      readOnly
                      isRequired
                      placeholder="Select a coin"
                      label="Select coin"
                      labelPlacement="outside"
                      variant="faded"
                      value={formData.cryptoCoinName}
                      onClick={() => {
                        onOpen();
                      }}
                    />
                  </div>
                )}

                {formData.category === "sports" && (
                  <div className="w-full">
                    <Input
                      size="lg"
                      readOnly
                      isRequired
                      placeholder="Select a match"
                      label="Select match"
                      labelPlacement="outside"
                      variant="faded"
                      onClick={() => {
                        setFootBallMatchDate("");
                        setMatches([]);
                        onOpen();
                      }}
                    />
                  </div>
                )}
              </>
            </div>

            {/*Crypto market interval field  */}
            <>
              {formData.category === "crypto" && (
                <div className="w-full">
                  <Select
                    variant="faded"
                    size="lg"
                    isRequired
                    label="Select interval"
                    labelPlacement="outside"
                    placeholder="Select an interval"
                    {...register("cryptoInterval")}
                  >
                    {[
                      { label: "1m", key: "1m" },
                      { label: "1d", key: "1d" },
                    ].map((intrvl) => (
                      <SelectItem key={intrvl.key}>{intrvl.label}</SelectItem>
                    ))}
                  </Select>
                </div>
              )}
            </>
            {/* Foot ball match start time */}
            <>
              {formData.category === "sports" && (
                <div className="w-full">
                  <DatePicker
                    size="lg"
                    variant="faded"
                    label="Match start date and time"
                    labelPlacement="outside"
                    isRequired
                    isReadOnly
                    hourCycle={24}
                    granularity="minute"
                  />
                </div>
              )}
            </>

            <div className="w-full">
              <Input
                type="text"
                placeholder="Enter market title"
                label="Title"
                labelPlacement="outside"
                isRequired
                size="lg"
                variant="faded"
                {...register("question")}
              />
            </div>

            <div className="w-full">
              <Textarea
                type="text"
                placeholder="Enter market settlement rules"
                label="Settlement rules"
                labelPlacement="outside"
                isRequired
                size="lg"
                variant="faded"
                {...register("settlementRules")}
              />
            </div>

            {/* Outcomes */}
            <div className="w-full">
              <p className="mb-1">
                Outcomes <span className="text-danger">*</span>
              </p>

              {formData.category === "crypto" ? (
                <Controller
                  name="outcomes"
                  control={control}
                  defaultValue={[]}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Card className="bg-default-100 border-2 border-default shadow-none">
                      <CardHeader className="text-default-500">
                        Add outcomes below
                      </CardHeader>
                      <CardBody>
                        <div className="mb-4">
                          {formData.outcomes?.map((otcm, i) => (
                            <ul key={i}>
                              <li className="capitalize font-semibold text-default-500">{`${i + 1}.  ${otcm.title}`}</li>
                            </ul>
                          ))}
                        </div>

                        <div className="flex flex-row gap-1">
                          <Input
                            placeholder="Enter outcome"
                            variant="faded"
                            value={outcome}
                            onChange={(e) => {
                              setOutcome(e.target.value);
                            }}
                          />
                          <Button
                            color="secondary"
                            variant="bordered"
                            onPress={() => {
                              const newList = [
                                ...field.value,
                                {
                                  title: outcome,
                                  price: 0,
                                  totalActiveTradingVolume: 0,
                                },
                              ];
                              field.onChange(newList);
                              setOutcome("");
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  )}
                />
              ) : (
                <Card className="bg-default-100 border-2 border-default shadow-none">
                  <CardHeader className="text-default-500">
                    Add outcomes below
                  </CardHeader>
                  <CardBody>
                    <p>Outcomes will appear here</p>
                  </CardBody>
                </Card>
              )}
            </div>

            <>
              <div className="w-full flex md:flex-row gap-2">
                <Controller
                  name="marketStarts"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <DatePicker
                      size="lg"
                      variant="faded"
                      label="Market starts"
                      labelPlacement="outside"
                      isRequired
                      hourCycle={24}
                      granularity="second"
                      onChange={(e) => {
                        const dateAndTime = getDate(e as CalendarDateTime);
                        field.onChange(dateAndTime);
                      }}
                    />
                  )}
                />

                {formData.category === "crypto" && (
                  <Controller
                    name="marketEnds"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DatePicker
                        size="lg"
                        variant="faded"
                        label="Market ends"
                        labelPlacement="outside"
                        isRequired
                        hourCycle={24}
                        granularity="second"
                        onChange={(e) => {
                          const dateAndTime = getDate(e as CalendarDateTime);
                          field.onChange(dateAndTime);
                        }}
                      />
                    )}
                  />
                )}
              </div>
            </>
            <div className="w-full">
              <Button type="submit" color="secondary" className="w-full">
                Submit
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
