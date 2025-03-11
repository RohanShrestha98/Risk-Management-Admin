export default function SideBarItems({
  item,
  handleActive,
  active,
  hideSidebar,
}) {
  return (
    <div
      key={item?.id}
      onClick={() => handleActive(item)}
      className={`${
        active === item?.link
          ? " border-blue-600 bg-blue-50  text-blue-600 "
          : "text-gray-600  border-transparent hover:bg-gray-50"
      } border-l-4  text-sm font-medium flex items-center  gap-2 px-4 py-3 cursor-pointer `}
    >
      <div className="text-lg">{item?.icon}</div>
      {!hideSidebar && <div className="line-clamp-1">{item?.name}</div>}
    </div>
  );
}
