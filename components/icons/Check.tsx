import classNames from "classnames"

const Check = ({colorClassName}: {colorClassName?: string}) => {
  return (
    <div className={classNames(["h-6 w-6", colorClassName && colorClassName])}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    );
  }

  export default Check;
