
import '../css/globals.css';
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer";
import { BsDiamond, BsStars, BsDownload, BsArrowsFullscreen, BsApp, BsCursorFill, BsCircleFill, BsHearts } from "react-icons/bs";
import { FaChildren } from "react-icons/fa6";

import imageSaveTreeName from '../photo/Create-new-tree.png';
import imageUseCanvas from '../photo/How-to-use-canvas.png';
import imageuseNodes from '../photo/How-to-use-nodes.png';
import imageWhatBtns from '../photo/What-is-the-btns.png';
import imageAddCharacter from '../photo/Add-character.png';
import imageAddPartner from '../photo/Add-partner.png';
import imageAddChild from '../photo/Add-child.png';
import imageSaveTree from '../photo/Save-tree.png';

interface Section {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  imageAlt: string;
  color: string;
  icon: React.ReactNode;
}

const sections = [
  {
    id: "getting-started",
    title: "Начало работы",
    description:
      'Для того, чтобы начать пользоваться возможностями нашего сайта, вам нужно открыть страницу "Древо". Вы увидите модальное окно, в котором нужно будет ввести название вашей новой династии. После чего вы получите доступ к холсту создания и редактирования узлов древа',
    imagePath: imageSaveTreeName,
    imageAlt: "Меню доступа к Древу династий",
    color: "pink-purple",
    icon: <BsStars className="icon" />,
  },
  {
    id: "how-to-use-tree",
    title: "Как пользоваться холстом",
    description:
      `Пользоваться холстом очень и очень просто! Использование на ПК: одним нажатием левой кнопкой мышки и ее перетаскиванием в любой части холста, мы можем двигать его в разные стороны, тем самым (если ваше древо уже большое) можно посмотреть все древо. Чтобы увеличить или уменьшить масштаб, достаточно навести курсор на холст и прокрутить колесиком мышки. Использование на мобильных устройствах: также тапом на холст и перетаскиванием пальцем можно просмотреть все древо. Чтобы увеличить или уменьшить масштаб, достаточко тапнуть двумя пальцами и свести их вместе.`,
    imagePath:imageUseCanvas,
    imageAlt: 'Как пользоваться холстом',
    color: 'blue-cyan',
    icon: <BsArrowsFullscreen className="icon" />,
  },
  {
    id: "how-to-use-nodes",
    title: "Как пользоваться узлами",
    description:
      'Чтобы начать работать с узлами, нужно просто нажать на кнопку "Редактировать", чтобы войти в режим редактирования древа. После чего (на ПК: навести курсор мышки на узел. На мобильных устройствах: нажать на узел пальчиком) откроется ряд возможностей: удаление, добавление персонажа, добавление ребенка персонажу и добавление партнера (см. далее о значении каждой кнопки)',
    imagePath:imageuseNodes,
    imageAlt: 'Как пользоваться узлами',
    color: 'blue-cyan',
    icon: <BsApp className="icon" />,
  },
  {
    id: "meaning-of-btns-on-nodes",
    title: "Значение кнопок на узлах",
    description:
      `Кнопка с мусорной корзиной означает удаление узла. (если вы удалите первый и единственный узел, ничего страшного! Просто перезагрузите страницу и узел снова будет на месте)
      Кнопка с шестерёнкой добавляет нового персонажа (но сначала его нужно будет выбрать или создать)
      Кнопка с плюсом добавит ребенка первому персонажу
      Кнопка с сердцем добавляет партнера персонажу (нужно будет выбрать тип связи и персонажа)
      `,
    imagePath: imageWhatBtns,
    imageAlt: "Значение кнопок на узлах",
    color: "blue-cyan",
    icon: <BsCursorFill className="icon" />,
  },
  {
    id: "adding-sims",
    title: "Добавление персонажей",
    description:
      'Чтобы добавить нового персонажа в древо, нажмите на кнопку с шестерёнкой. Вы можете создать нового персонажа или добавить существующего из списка.',
    imagePath: imageAddCharacter,
    imageAlt: "Добавление персонажей в древо",
    color: "green-emerald",
    icon: <BsCircleFill className="icon" />,
  },
  {
    id: "adding-relationships",
    title: "Добавление партнеров персонажам",
    description:
      'Для добавления персонажу партнера, нужно нажать на сердце. Вы можете выбрать тип связи персонажам и выбрать самого партнера (или создать нового)',
    imagePath: imageAddPartner,
    imageAlt: "Добавление партнеров",
    color: "green-emerald",
    icon: <BsHearts className="icon" />,
  },
  {
    id: "adding-child",
    title: "Добавление детей",
    description:
      "Вы можете добавлять детей своим персонажам, по нажатию на кнопку плюса. Для того, чтобы доавить персонажа в узел нажмите на шестеренку и выберите персонажа",
    imagePath: imageAddChild,
    imageAlt: "Добавление детей",
    color: "green-emerald",
    icon: <FaChildren className="icon" />,
  },
  {
    id: "exporting-tree",
    title: "Сохранение древа",
    description:
      'Чтобы сохранить ваше созданное древо и оно никуда не потерялось, нужно просто после завершения работы с деревом нажать на кнопку "Сохранить". Вот и всё, ваше древо сохранено!',
    imagePath: imageSaveTree,
    imageAlt: "Сохранение древа династий",
    color: "purple-pink",
    icon: <BsDownload className="icon" />,
  },
]

function InstructionCard({ section, index }: { section: Section; index: number }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      className={`instruction-card ${isEven ? "even" : "odd"}`}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="text-content">
        <motion.div className={`content-card ${section.color}`} whileHover={{ y: -5 }}>
          <div className="card-header">
            <div className="icon-wrapper">{section.icon}</div>
            <h2 className="card-title">{section.title}</h2>
          </div>
          <p className="card-description">{section.description}</p>
        </motion.div>
      </div>

      <div className="image-content">
        <motion.div className="image-wrapper" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <img
            src={section.imagePath || "/placeholder.svg?height=400&width=600"}
            alt={section.imageAlt}
            className="card-image"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="image-overlay" />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  return (
    <main className="main-container">
      {/* Заголовок страницы */}
      <div className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-title">
              <BsDiamond className="hero-diamond left" />
              <h1 className="main-title">Sims Tree</h1>
              <BsDiamond className="hero-diamond right" />
            </div>
            <p className="hero-subtitle">Полное руководство по использованию функции Древа династий в The Sims 4</p>
          </motion.div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="content-container">
        <div className="content-wrapper">
          {sections.map((section, index) => (
            <InstructionCard key={section.id} section={section} index={index} />
          ))}
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="decoration decoration-left">
        <BsDiamond className="decoration-diamond pink" />
      </div>
      <div className="decoration decoration-right">
        <BsDiamond className="decoration-diamond blue" />
      </div>
    </main>
  )
}
