import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  DatePicker,
  Divider,
  Form,
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
import type { Market2 } from "@repo/types/src";
import { Controller, useForm } from "react-hook-form";
import getDate, { getCoins, marketCategory, type Coin } from "../utils/lib";
import {
  getLocalTimeZone,
  today,
  type CalendarDateTime,
} from "@internationalized/date";
import { Search } from "lucide-react";
import { useState } from "react";

export default function MarketCreationForm2() {
  const { register, handleSubmit, watch, control, reset } = useForm<Market2>();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [coinSearchVal, setCoinSearchVal] = useState("");
  const formData = watch();
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [outcome, setOutcome] = useState("");
  console.log(formData);

  const onSubmit = (data: any) => console.log(data);

  return (
    <div className="py-3">
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="py-3"
        size="xl"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                {/* Crypto market */}
                {formData.categoryData?.category === "crypto" && (
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
                {formData.categoryData?.category === "sports" && (
                  <div className="w-full">
                    <div className="space-y-2">
                      <DatePicker
                        label="Select match date"
                        labelPlacement="outside"
                        granularity="day"
                        defaultValue={today(getLocalTimeZone())}
                        maxValue={today(getLocalTimeZone()).add({ days: 1 })}
                        minValue={today(getLocalTimeZone())}
                        onChange={(e) => {
                          console.log(e?.year);
                        }}
                      />
                      <Button size="sm" color="secondary" variant="faded">
                        Search
                      </Button>
                    </div>
                    <Divider className="my-4" />

                    <div></div>
                  </div>
                )}
              </ModalHeader>
              <ModalBody>
                {/* Crypto market */}
                {formData.categoryData?.category === "crypto" && (
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
                            name="categoryData.coinName"
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
                  {...register("categoryData.category")}
                >
                  {marketCategory.map((mrktctgry) => (
                    <SelectItem key={mrktctgry.key}>
                      {mrktctgry.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <>
                {formData.categoryData?.category === "crypto" && (
                  <div className="w-full">
                    <Input
                      size="lg"
                      readOnly
                      isRequired
                      placeholder="Select a coin"
                      label="Select coin"
                      labelPlacement="outside"
                      variant="faded"
                      value={formData.categoryData.coinName}
                      onClick={() => {
                        onOpen();
                      }}
                    />
                  </div>
                )}

                {formData.categoryData?.category === "sports" && (
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
                        onOpen();
                      }}
                    />
                  </div>
                )}
              </>
            </div>

            {/*Crypto market interval field  */}
            <>
              {formData.categoryData?.category === "crypto" && (
                <div className="w-full">
                  <Select
                    variant="faded"
                    size="lg"
                    isRequired
                    label="Select interval"
                    labelPlacement="outside"
                    placeholder="Select an interval"
                    {...register("categoryData.interval")}
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
              {formData.categoryData?.category === "sports" && (
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
                {...register("metadata.title")}
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
                {...register("metadata.settlementRules")}
              />
            </div>

            {/* Outcomes */}
            <div className="w-full">
              <p className="mb-1">
                Outcomes <span className="text-danger">*</span>
              </p>

              {formData.categoryData?.category === "crypto" ? (
                <Controller
                  name="metadata.ouctomes"
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
                          {formData.metadata?.ouctomes.map((otcm, i) => (
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
                  name="metadata.marketStarts"
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

                {formData.categoryData?.category === "crypto" && (
                  <Controller
                    name="metadata.marketEnds"
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
