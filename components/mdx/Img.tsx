export interface Props {
  alt: string;
  src: string;
}

const Img = (props: Props) => {
  return (
    <p className="grid place-content-center">
      <img src={props.src} alt={props.alt} />
    </p>
  );
};

export default Img;
