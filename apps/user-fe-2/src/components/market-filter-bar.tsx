import {
  CheckboxGroup,
  Chip,
  tv,
  useCheckbox,
  VisuallyHidden,
} from "@heroui/react";
import {
  marketFilter,
  type MarketCategoryEnum,
  type MarketStatusEnum,
} from "../store/market-filter";

const marketStatuses = [
  { title: "Open", value: "open" },
  { title: "Will Open", value: "not_started" },
  { title: "Settled", value: "settled" },
  { title: "Cancelled", value: "cancelled" },
];

const marketCategories = [
  { title: "All", value: "all" },
  { title: "Crypto", value: "crypto" },
  { title: "Politics", value: "politics" },
  { title: "Sports", value: "sports" },
  { title: "Regular", value: "regular" },
];

export const CustomCheckbox = (props: any) => {
  const checkbox = tv({
    slots: {
      base: "border-default hover:bg-default-200",
      content: "text-default-500",
    },
    variants: {
      isSelected: {
        true: {
          base: "border-primary bg-primary hover:bg-primary-500 hover:border-primary-500",
          content: "text-primary-foreground pl-1",
        },
      },
      isFocusVisible: {
        true: {
          base: "outline-solid outline-transparent ring-2 ring-focus ring-offset-2 ring-offset-background",
        },
      },
    },
  });

  const {
    children,
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    ...props,
  });

  const styles = checkbox({ isSelected, isFocusVisible });

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Chip
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        color="primary"
        variant="faded"
        {...getLabelProps()}
      >
        {children ? children : isSelected ? "Enabled" : "Disabled"}
      </Chip>
    </label>
  );
};

export default function MarketFilterbar() {
  const {
    marketStatus,
    marketCategory,
    changeMarketCategory,
    changeMarketStatus,
  } = marketFilter();

  const handleMarketCatgoryChange = ({
    ctegory,
  }: {
    ctegory: MarketCategoryEnum;
  }) => {
    changeMarketCategory({ catgry: ctegory });
  };

  const handleMarketStatusChange = ({ sttus }: { sttus: MarketStatusEnum }) => {
    changeMarketStatus({ status: sttus });
  };
  return (
    <div className="bg-default py-2 mt-2 max-w-7xl mx-auto rounded-full">
      <div className="flex items-center justify-center gap-8">
        {/* Market status */}
        <div className="flex flex-col justify-center items-center">
          <div>
            <Chip color="warning" variant="faded">
              <span className="font-semibold text-lg">Market status</span>
            </Chip>
          </div>
          <div>
            <CheckboxGroup
              defaultValue={[...marketStatus]}
              orientation="horizontal"
            >
              {marketStatuses.map((status, i) => (
                <div
                  key={i}
                  onClick={() => {
                    handleMarketStatusChange({
                      sttus: status.value as MarketStatusEnum,
                    });
                  }}
                >
                  <CustomCheckbox value={status.value}>
                    {status.title}
                  </CustomCheckbox>
                </div>
              ))}
            </CheckboxGroup>
          </div>
        </div>

        {/* Divider */}
        <div className="bg-default-100 h-16 w-1" />

        {/* Market Category */}
        <div className="flex flex-col justify-center items-center">
          <div>
            <Chip color="warning" variant="faded">
              <span className="font-semibold text-lg">Market category</span>
            </Chip>
          </div>
          <div>
            <CheckboxGroup
              defaultValue={[...marketCategory]}
              orientation="horizontal"
            >
              {marketCategories.map((category, i) => (
                <div
                  key={i}
                  onClick={() => {
                    handleMarketCatgoryChange({
                      ctegory: category.value as MarketCategoryEnum,
                    });
                  }}
                >
                  <CustomCheckbox value={category.value}>
                    {category.title}
                  </CustomCheckbox>
                </div>
              ))}
            </CheckboxGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
