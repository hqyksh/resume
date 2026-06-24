import FramerWrapper from "./animation/FramerWrapper";

const Heading = ({ children }: { children: React.ReactNode }) => {
  // CUSTOM HEADING FOR ALL PAGE
  return (
    <FramerWrapper y={0} x={-100}>
      <h1 className="first-letter:uppercase font-poppins text-3xl name_underline max-sm:text-2xl mt-8 text-black dark:text-white">
        {children}
      </h1>
    </FramerWrapper>
  );
};

export default Heading;
