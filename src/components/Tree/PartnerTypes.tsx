import { TbCirclesRelation } from "react-icons/tb"; //married женаты
import { LiaRingSolid } from "react-icons/lia";//divorced в разводе
import { GiBigDiamondRing } from "react-icons/gi"; //engaged помолвлены
import { BsChatHeart } from "react-icons/bs";//flirting флирт
import { FaHeartBroken } from "react-icons/fa";//former бывшие
import { FaHeart } from "react-icons/fa";//partner партнер
import { GiHeartWings } from "react-icons/gi"; //widow вдовцы
import { FaUserFriends } from "react-icons/fa"; //friends друзья

import { PartnerType } from "./Tree.types";

export const partnerTypes = [
  { type: "married" as PartnerType, label: "Супруги", icon: <TbCirclesRelation /> },
  { type: "divorced" as PartnerType, label: "В разводе", icon: <LiaRingSolid /> },
  { type: "engaged" as PartnerType, label: "Помолвлены", icon: <GiBigDiamondRing /> },
  { type: "flirting" as PartnerType, label: "Флирт", icon: <BsChatHeart /> },
  { type: "former" as PartnerType, label: "Бывшие", icon: <FaHeartBroken /> },
  { type: "partner" as PartnerType, label: "Партнер", icon: <FaHeart /> },
  { type: "widow" as PartnerType, label: "Вдовец/Вдова", icon: <GiHeartWings /> },
  { type: "friends" as PartnerType, label: "Друзья", icon: <FaUserFriends /> },
];