import { useEffect, type ReactNode } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { BsDiamond, BsTree, BsPeople, BsPencilSquare, BsArrowRight } from "react-icons/bs"
import "../css/home.css";
import image from '../photo/Example-tree.png';

interface AnimatedSectionProps {
  children: ReactNode
  delay?: number
}

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  color: string
}

function AnimatedSection({ children, delay = 0 }: AnimatedSectionProps) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: delay,
            ease: "easeOut",
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <motion.div
      className={`feature-card ${color}`}
      whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="feature-icon-wrapper">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </motion.div>
  )
}

export default function HomePage() {
  const features = [
    {
      icon: <BsTree />,
      title: "Интерактивное древо династий",
      description:
        "Создавайте и настраивайте родословные для ваших персонажей с визуализацией связей и отношений между ними.",
      color: "pink-purple",
    },
    {
      icon: <BsPeople />,
      title: "Создание персонажей",
      description: "Добавляйте новых персонажей в вашу династию с подробными профилями, характеристиками и историями.",
      color: "blue-cyan",
    },
    {
      icon: <BsPencilSquare />,
      title: "Написание статей",
      description: "Публикуйте собственные статьи о ваших династиях, делитесь советами и историями с сообществом.",
      color: "green-emerald",
    },
  ]

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-title-wrapper">
              <h1 className="hero-title">Sims Tree</h1>
            </div>
            <p className="hero-subtitle">Создавайте, редактируйте и делитесь историями ваших династий</p>
            <p className="hero-subtitle">в The Sims 4</p>
            <div className="hero-buttons">
              <a href="/tree" className="primary-button">
                Начать создание
                <BsArrowRight className="button-icon" />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="hero-image-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-image-wrapper">
              <img
                src={image}
                alt="Пример древа династий"
                width={600}
                height={400}
                className="hero-image"
              />
              <div className="image-decoration top"></div>
              <div className="image-decoration bottom"></div>
            </div>
          </motion.div>
        </div>

        <div className="hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      <section className="about-section">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="section-title">Что такое Древо династий?</h2>
            <div className="section-divider"></div>
            <p className="section-description">
              Наш сервис позволяет игрокам The Sims 4 создавать интерактивные родословные для своих персонажей,
              отслеживать историю семьи и делиться своими династиями с сообществом. Независимо от того, играете ли вы в
              The Sims 4 уже много лет или только начинаете, наш инструмент поможет вам организовать и визуализировать
              историю ваших симов.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="features-section">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="section-title">Возможности сервиса</h2>
            <div className="section-divider"></div>
          </AnimatedSection>

          <div className="features-grid">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  color={feature.color}
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="section-title">Как это работает</h2>
            <div className="section-divider"></div>
          </AnimatedSection>

          <div className="steps-container">
            <AnimatedSection delay={0.1}>
              <div className="step-card">
                <div className="step-number">1</div>
                <h3 className="step-title">Создайте аккаунт</h3>
                <p className="step-description">
                  Зарегистрируйтесь на нашем сайте, чтобы получить доступ ко всем функциям и сохранять свои династии.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3 className="step-title">Создайте династию</h3>
                <p className="step-description">
                  Начните с создания новой династии и добавления основателя — первого персонажа вашей родословной.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3 className="step-title">Добавляйте персонажей</h3>
                <p className="step-description">
                  Расширяйте свою династию, добавляя новых персонажей и устанавливая связи между ними.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="step-card">
                <div className="step-number">4</div>
                <h3 className="step-title">Делитесь и развивайте</h3>
                <p className="step-description">
                  Пишите статьи о своих династиях, новостях и получайте удовольствие от прочтения.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-overlay"></div>
        <div className="section-container">
          <AnimatedSection>
            <h2 className="cta-title">Готовы начать свою историю?</h2>
            <p className="cta-description">
              Присоединяйтесь к тысячам игроков, которые уже создают и делятся своими династиями
            </p>
            <a href="/auth" className="cta-button">
              Создать аккаунт
              <BsArrowRight className="button-icon" />
            </a>
          </AnimatedSection>
        </div>
      </section>

      <div className="decoration decoration-top-left">
        <BsDiamond className="decoration-diamond pink" />
      </div>
      <div className="decoration decoration-bottom-right">
        <BsDiamond className="decoration-diamond blue" />
      </div>
    </div>
  )
}
