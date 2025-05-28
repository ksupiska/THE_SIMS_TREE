
import '../css/globals.css';
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { BsDiamond, BsArrowRight, BsStars, BsPeople, BsGear, BsDownload } from "react-icons/bs"

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
      'Чтобы начать использовать Древо династий, откройте игру The Sims 4 и перейдите в режим жизни. Нажмите на кнопку меню в правом верхнем углу экрана и выберите "Древо династий" из выпадающего меню.',
    imagePath: "/images/getting-started.png",
    imageAlt: "Меню доступа к Древу династий",
    color: "pink-purple",
    icon: <BsStars className="icon" />,
  },
  {
    id: "viewing-tree",
    title: "Просмотр древа",
    description:
      "В Древе династий вы увидите всех связанных персонажей вашей текущей семьи. Линии показывают родственные связи: зеленые линии обозначают кровное родство, синие — брачные узы, а оранжевые — усыновление.",
    imagePath: "/images/viewing-tree.png",
    imageAlt: "Просмотр древа династий",
    color: "blue-cyan",
    icon: <BsPeople className="icon" />,
  },
  {
    id: "adding-sims",
    title: "Добавление персонажей",
    description:
      'Чтобы добавить нового персонажа в древо, нажмите на кнопку "+" в нижней части экрана. Вы можете создать нового персонажа или добавить существующего из библиотеки игры.',
    imagePath: "/images/adding-sims.png",
    imageAlt: "Добавление персонажей в древо",
    color: "green-emerald",
    icon: <BsArrowRight className="icon" />,
  },
  {
    id: "editing-relationships",
    title: "Редактирование связей",
    description:
      'Для изменения связей между персонажами выберите персонажа и нажмите на кнопку "Редактировать связи". Затем выберите тип связи и другого персонажа, с которым хотите установить отношения.',
    imagePath: "/images/editing-relationships.png",
    imageAlt: "Редактирование связей между персонажами",
    color: "yellow-orange",
    icon: <BsGear className="icon" />,
  },
  {
    id: "customizing-tree",
    title: "Настройка внешнего вида",
    description:
      "Вы можете настроить внешний вид древа, изменив фон, стиль линий и размер изображений персонажей. Для этого нажмите на кнопку настроек в правом нижнем углу экрана.",
    imagePath: "/images/customizing-tree.png",
    imageAlt: "Настройка внешнего вида древа",
    color: "purple-pink",
    icon: <BsDiamond className="icon" />,
  },
  {
    id: "exporting-tree",
    title: "Экспорт древа",
    description:
      'Чтобы сохранить изображение вашего древа династий, нажмите на кнопку "Экспорт" в нижней панели инструментов. Вы можете выбрать формат изображения и место сохранения.',
    imagePath: "/images/exporting-tree.png",
    imageAlt: "Экспорт древа династий",
    color: "indigo-blue",
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
              <h1 className="main-title">Древо династий</h1>
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
