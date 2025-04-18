// src/pages/Home.tsx
import React from 'react';

import { Carousel, Container, Col, Row } from "react-bootstrap";

import firstSlide from "../photo/first-slide.png";
import secondSlide from "../photo/second-slide.png";
import thirdSlide from "../photo/third-slide.png";

import '../css/home.css';

const Home = () => {
  return <div className='home'>
    <h1 className=" w-100 p-3 text-center">Создайте древо династии прямо сейчас!</h1>

    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={firstSlide}
          alt="First slide"
        />
        <Carousel.Caption>
          <h1>The Sims Tree</h1>
          <h3>Save your story</h3>
          <p>Создавайте уникальные семейные истории</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={secondSlide}
          alt="Second slide"
        />
        <Carousel.Caption>
          <h1>The Sims Tree</h1>
          <h3>Save your story</h3>
          <p>следите за развитием своих персонажей и передавайте свои незабываемые моменты из поколения в поколение</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={thirdSlide}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h1>The Sims Tree</h1>
          <h3>Save your story</h3>
          <p>Начните строить свой собственный мир вместе с нами и оставьте след в истории!</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    <h1 className='w-100 p-3 text-center'>наши сервисы</h1>
    <Container>
      <Row>
        <Col>
          <section className='d-flex justify-content-center'>
            <svg width="106" height="72" viewBox="0 0 106 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d_40_51)">
                <circle cx="54.5" cy="42.5" r="15.5" stroke="black" stroke-width="2" />
                <circle cx="54.5" cy="38.5" r="6.5" stroke="black" stroke-width="2" />
                <mask id="path-3-inside-1_40_51" fill="white">
                  <path d="M65 54.5C65 51.7152 63.8938 49.0445 61.9246 47.0754C59.9555 45.1062 57.2848 44 54.5 44C51.7152 44 49.0445 45.1062 47.0754 47.0754C45.1062 49.0445 44 51.7152 44 54.5L45.9191 54.5C45.9191 52.2242 46.8232 50.0416 48.4324 48.4324C50.0416 46.8232 52.2242 45.9191 54.5 45.9191C56.7758 45.9191 58.9584 46.8232 60.5676 48.4324C62.1768 50.0416 63.0809 52.2242 63.0809 54.5H65Z" />
                </mask>
                <path d="M65 54.5C65 51.7152 63.8938 49.0445 61.9246 47.0754C59.9555 45.1062 57.2848 44 54.5 44C51.7152 44 49.0445 45.1062 47.0754 47.0754C45.1062 49.0445 44 51.7152 44 54.5L45.9191 54.5C45.9191 52.2242 46.8232 50.0416 48.4324 48.4324C50.0416 46.8232 52.2242 45.9191 54.5 45.9191C56.7758 45.9191 58.9584 46.8232 60.5676 48.4324C62.1768 50.0416 63.0809 52.2242 63.0809 54.5H65Z" fill="#D9D9D9" stroke="black" stroke-width="2" mask="url(#path-3-inside-1_40_51)" />
                <circle cx="27.5" cy="20.5" r="15.5" stroke="black" stroke-width="2" />
                <circle cx="27.5" cy="16.5" r="6.5" stroke="black" stroke-width="2" />
                <mask id="path-6-inside-2_40_51" fill="white">
                  <path d="M38 32.5C38 29.7152 36.8938 27.0445 34.9246 25.0754C32.9555 23.1062 30.2848 22 27.5 22C24.7152 22 22.0445 23.1062 20.0754 25.0754C18.1062 27.0445 17 29.7152 17 32.5L18.9191 32.5C18.9191 30.2242 19.8232 28.0416 21.4324 26.4324C23.0416 24.8232 25.2242 23.9191 27.5 23.9191C29.7758 23.9191 31.9584 24.8232 33.5676 26.4324C35.1768 28.0416 36.0809 30.2242 36.0809 32.5H38Z" />
                </mask>
                <path d="M38 32.5C38 29.7152 36.8938 27.0445 34.9246 25.0754C32.9555 23.1062 30.2848 22 27.5 22C24.7152 22 22.0445 23.1062 20.0754 25.0754C18.1062 27.0445 17 29.7152 17 32.5L18.9191 32.5C18.9191 30.2242 19.8232 28.0416 21.4324 26.4324C23.0416 24.8232 25.2242 23.9191 27.5 23.9191C29.7758 23.9191 31.9584 24.8232 33.5676 26.4324C35.1768 28.0416 36.0809 30.2242 36.0809 32.5H38Z" fill="#D9D9D9" stroke="black" stroke-width="2" mask="url(#path-6-inside-2_40_51)" />
                <circle cx="80.5" cy="20.5" r="15.5" stroke="black" stroke-width="2" />
                <circle cx="80.5" cy="16.5" r="6.5" stroke="black" stroke-width="2" />
                <mask id="path-9-inside-3_40_51" fill="white">
                  <path d="M91 32.5C91 29.7152 89.8938 27.0445 87.9246 25.0754C85.9555 23.1062 83.2848 22 80.5 22C77.7152 22 75.0445 23.1062 73.0754 25.0754C71.1062 27.0445 70 29.7152 70 32.5L71.9191 32.5C71.9191 30.2242 72.8232 28.0416 74.4324 26.4324C76.0416 24.8232 78.2242 23.9191 80.5 23.9191C82.7758 23.9191 84.9584 24.8232 86.5676 26.4324C88.1768 28.0416 89.0809 30.2242 89.0809 32.5H91Z" />
                </mask>
                <path d="M91 32.5C91 29.7152 89.8938 27.0445 87.9246 25.0754C85.9555 23.1062 83.2848 22 80.5 22C77.7152 22 75.0445 23.1062 73.0754 25.0754C71.1062 27.0445 70 29.7152 70 32.5L71.9191 32.5C71.9191 30.2242 72.8232 28.0416 74.4324 26.4324C76.0416 24.8232 78.2242 23.9191 80.5 23.9191C82.7758 23.9191 84.9584 24.8232 86.5676 26.4324C88.1768 28.0416 89.0809 30.2242 89.0809 32.5H91Z" fill="#D9D9D9" stroke="black" stroke-width="2" mask="url(#path-9-inside-3_40_51)" />
                <line x1="43" y1="19" x2="65" y2="19" stroke="black" stroke-width="2" />
                <line x1="33.7614" y1="35.3517" x2="38.9477" y2="41.4429" stroke="black" stroke-width="2" />
                <line x1="74.8521" y1="35.6349" x2="69.7725" y2="41.8154" stroke="black" stroke-width="2" />
                <circle cx="98" cy="4" r="3" stroke="black" stroke-width="2" />
                <circle cx="8" cy="7" r="3" stroke="black" stroke-width="2" />
                <circle cx="90.8486" cy="42.0015" r="3" transform="rotate(-166.005 90.8486 42.0015)" stroke="black" stroke-width="2" />
                <circle cx="70.8486" cy="60.0015" r="3" transform="rotate(-166.005 70.8486 60.0015)" stroke="black" stroke-width="2" />
                <circle cx="31.8486" cy="44.0015" r="3" transform="rotate(-166.005 31.8486 44.0015)" stroke="black" stroke-width="2" />
                <line x1="95.8" y1="6.6" x2="92.8" y2="10.6" stroke="black" stroke-width="2" />
                <line x1="10.8" y1="9.4" x2="13.8" y2="13.4" stroke="black" stroke-width="2" />
                <line x1="88.7121" y1="38.9955" x2="86.7685" y2="34.3888" stroke="black" stroke-width="2" />
                <line x1="68.7121" y1="56.9955" x2="66.7685" y2="52.3888" stroke="black" stroke-width="2" />
                <line x1="29.7121" y1="40.9955" x2="27.7685" y2="36.3888" stroke="black" stroke-width="2" />
              </g>
              <defs>
                <filter id="filter0_d_40_51" x="0" y="0" width="106" height="72.0024" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_40_51" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_40_51" result="shape" />
                </filter>
              </defs>
            </svg>
          </section>
          <h3 className='text-center fw-bold fs-3'>Династии</h3>
          <p className='text-center fw-light'>Создавайте уникальные династийные древа для своих семейных историй. Отслеживайте развитие своих персонажей и сохраняйте их наследие в увлекательных сагах.</p>
        </Col>
        <Col>
          <section className='d-flex justify-content-center'>
            <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <rect width="51" height="51" fill="url(#pattern0_40_72)" />
              <defs>
                <pattern id="pattern0_40_72" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlinkHref="#image0_40_72" transform="scale(0.0078125)" />
                </pattern>
                <image id="image0_40_72" width="128" height="128" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
              </defs>
            </svg>
          </section>
          <h3 className='text-center fw-bold fs-3'>Кастомизация</h3>
          <p className='text-center fw-light'>Воплощайте свои идеи в жизнь с помощью множества инструментов для кастомизации древ. Выбирайте цвета, шрифты и фоны, чтобы сделать вашу историю уникальной.</p>
        </Col>
        <Col>
          <section className='d-flex justify-content-center'>
            <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <rect width="51" height="51" fill="url(#pattern0_40_84)" />
              <defs>
                <pattern id="pattern0_40_84" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlinkHref="#image0_40_84" transform="scale(0.0078125)" />
                </pattern>
                <image id="image0_40_84" width="128" height="128" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
              </defs>
            </svg>
          </section>
          <h3 className='text-center fw-bold fs-3'>Фоторедактор</h3>
          <p className='text-center fw-light'>Выберите собственный стиль и атмосферу с помощью фоторедактора. Редактируйте фотографии своих персонажей и древ, чтобы подчеркнуть их характер и настроение.</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <section className='d-flex justify-content-center'>

            <svg width="51" height="51" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <rect width="128" height="128" fill="url(#pattern0_1_2)" />
              <defs>
                <pattern id="pattern0_1_2" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlinkHref="#image0_1_2" transform="scale(0.0078125)" />
                </pattern>
                <image id="image0_1_2" width="128" height="128" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
              </defs>
            </svg>

          </section>
          <h3 className='text-center fw-bold fs-3'>Галерея</h3>
          <p className='text-center fw-light'>Храните фотографии своих персонажей и их приключений в галерее. Создавайте воспоминания и делитесь ими с другими пользователями.</p>
        </Col>
        <Col>
          <section className='d-flex justify-content-center'>
            <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <rect width="51" height="51" fill="url(#pattern0_40_115)" />
              <defs>
                <pattern id="pattern0_40_115" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlinkHref="#image0_40_115" transform="scale(0.0078125)" />
                </pattern>
                <image id="image0_40_115" width="128" height="128" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
              </defs>
            </svg>
          </section>
          <h3 className='text-center fw-bold fs-3'>Сообщество</h3>
          <p className='text-center fw-light'>Публикуйте свои династии в галерее и делитесь ими с сообществом. Дайте другим увидеть вашу творческую работу и получите вдохновение от историй других участников.</p>
        </Col>
      </Row>
    </Container>
  </div>;
};

export default Home;
