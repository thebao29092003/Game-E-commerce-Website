
import { Rating } from "react-simple-star-rating";
import "./RatingStar.css"

const RatingStar = ({
  allowHover,
  initialValue,
  handleRating,
  onPointerEnter,
  onPointerLeave,
  onPointerMove,
  readonly = false
}) => {
  return (
    <>
      <Rating
        initialValue={initialValue}
        allowHover={allowHover}
        fillColor="rgb(0,174,215)"
        className="rating-star"
        onClick={handleRating}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerMove={onPointerMove}
        readonly = {readonly}
        /* Available Props */
      />
    </>
  );
};

export default RatingStar;
