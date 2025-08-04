import React from 'react';
import * as RiIcons from 'react-icons/ri';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as HiIcons from 'react-icons/hi';
import * as BsIcons from 'react-icons/bs';

const iconPacks = {
  ri: RiIcons,
  fa: FaIcons,
  md: MdIcons,
  hi: HiIcons,
  bs: BsIcons,
};

export default function Icon({ name, pack = 'ri', size = 32, color = 'inherit', ...props }) {
  const IconComponent = iconPacks[pack][name];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} aria-hidden="true" {...props} />;
}
