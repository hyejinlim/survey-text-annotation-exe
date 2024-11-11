type Props = {
  total: any;
};

function MemberListTotal({ total }: Props) {
  return (
    <div className="d-flex justify-content-start align-items-center m-2 h-100">
      <span>
        총<strong>{total}</strong> 건
      </span>
    </div>
  );
}

export default MemberListTotal;
