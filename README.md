# StudySync-DAM
# 🚀 StudySync: Tu Centro de Control Académico Todo en Uno

## Ciclo Formativo de Grado Superior: Desarrollo de Aplicaciones Multiplataforma (DAM)
**Autor:** Antonio Jesús Orellana Orea 

---

## 🧭 Índice
* [1. Introducción](#1-introducción)
    * [1.1. Descripción del Proyecto](#11-descripción-del-proyecto)
    * [1.2. Justificación](#12-justificación)
    * [1.3. Objetivos](#13-objetivos)
    * [1.4. Motivación](#14-motivación)
* [2. Funcionalidades Clave y Tecnologías](#2-funcionalidades-clave-y-tecnologías)
    * [2.1. Funcionalidades](#21-funcionalidades)
    * [2.2. Tecnologías (Stack)](#22-tecnologías-stack)
* [3. Guía de Instalación](#3-guía-de-instalación)
* [4. Guía de Uso](#4-guía-de-uso)
* [5. Documentación y Recursos](#5-documentación-y-recursos)
* [6. Conclusión](#6-conclusión)
* [7. Contribuciones, Agradecimientos y Referencias](#7-contribuciones-agradecimientos-y-referencias)
* [8. Licencia](#8-licencia)
* [9. Contacto](#9-contacto)

---

## 1. Introducción

### 1.1. Descripción del Proyecto
**StudySync** es una **aplicación multiplataforma** (Móvil y Web) diseñada para estudiantes.Su idea principal es consolidar en un solo lugar todas las herramientas necesarias para la organización y el estudio efectivo: planificador académico, gestor de tareas, temporizador de concentración y tarjetas de repaso.Buscamos ofrecer la potencia de herramientas profesionales con la sencillez y el diseño intuitivo de una app moderna.

### 1.2. Justificación
La temática se justifica en la **fragmentación de herramientas** existente. Los estudiantes se ven obligados a usar MyStudyLife para horarios, Forest para concentración, Anki para memorización, y Todoist para tareas. StudySync elimina esta fricción al integrar las mejores características de cada uno en un diseño limpio y enfocado en la experiencia de usuario.

### 1.3. Objetivos
* Desarrollar una aplicación **multiplataforma** funcional (Mobile/Web).
* Integrar un sistema de **gamificación** (tipo Forest) con el temporizador Pomodoro para fomentar la concentración.
* Implementar un sistema de **Tarjetas de Repaso (Flashcards)** basado en el algoritmo de Repetición Espaciada (SRS).
* Ofrecer una interfaz **limpia y minimalista** con un *onboarding* rápido.

### 1.4. Motivación
La principal motivación es crear una herramienta que hubiéramos deseado tener como estudiantes, facilitando la organización y mejorando la efectividad del estudio a través de la tecnología y el diseño centrado en el usuario.

---

## 2. Funcionalidades Clave y Tecnologías

### 2.1. Funcionalidades
* **Gestor de Tareas y Horarios:** Calendario académico, clases, exámenes, y tareas por asignatura con subtareas, etiquetas, y prioridades (inspirado en MyStudyLife y Todoist).
* **Concentración Gamificada:** Temporizador Pomodoro integrado con estadísticas y un sistema de recompensa tipo **Forest** (crece una planta/mascota virtual).
* **Tarjetas de Repaso SRS:** Sistema de flashcards con repetición espaciada para optimizar la memorización (inspirado en Anki).
* **Estadísticas de Estudio:** Seguimiento del tiempo total, materias más estudiadas y racha de días seguidos.
* **Herramientas Extra:** Calculadora de nota final, lista de materias, y modo "examen" (bloqueo de notificaciones).
* **UX/Diseño:** Personalización de temas, animaciones de recompensa y diseño limpio.

### 2.2. Tecnologías (Stack)
| Componente | Tecnología | Razón / Uso |
| :--- | :--- | :--- |
| **Frontend Móvil/Web** | **React Native** / **React.js** | Desarrollo multiplataforma con una única base de código. |
| **Backend (API)** | **Spring Boot (Java)** | Lógica de servidor, gestión de usuarios, estadísticas, y algoritmo SRS. |
| **Base de Datos** | **MySQL / PostgreSQL** | Almacenamiento estructurado de datos de usuario, tareas y seguimiento SRS. |
| **Diseño** | **Figma** | Prototipado y diseño de la interfaz minimalista. |
| **Futura IA** | **Python** | Integración futura para generación de resúmenes y tarjetas automáticas. |

---

## 3. Guía de Instalación

1.  **Clonar el Repositorio:** `git clone https://aws.amazon.com/es/what-is/repo/`
2.  **Configurar el Backend (Spring Boot):**
    * ... (Pasos para configurar la BD y levantar el servidor)
3.  **Configurar el Frontend (React Native):**
    * ... (Pasos para instalar dependencias y ejecutar en emulador/dispositivo)

---

## 4. Guía de Uso

1.  **Registro/Login:** Inicia sesión con Google o usa el Modo Sin Cuenta (guardado local).
2.  **Pantalla "Hoy":** Visualiza rápidamente las clases, tareas pendientes y recordatorios importantes.
3.  **Planificación:** Crea asignaturas y añade tareas, dándoles prioridad y fecha de entrega.
4.  **Estudio Activo:** Inicia un Pomodoro en la materia elegida. Si lo completas, verás crecer tu planta/mascota virtual.
5.  **Repaso:** Crea o importa mazos de tarjetas y usa el modo de repetición espaciada para memorizar eficazmente.

---

## 5. Documentación y Recursos

| Recurso | Enlace | Descripción |
| :--- | :--- | :--- |
| **Documentación Completa** | [Enlace a Documentación (Web/Notion)] | Contiene diagramas UML, ER, Casos de Prueba, y detalles de arquitectura. |
| **Prototipo de Interfaz (Figma)** | [Enlace a Figma] | Wireframes, mockups y guía de estilos UX/UI. |
| **Kanban Board** | [[Enlace al Kanban Board (Trello/Notion)](https://trello.com/invite/b/692d784e1b519e766e1a91de/ATTI0eac0c17c07ddb5d41598610c61522365576E534/proyecto)] | Seguimiento de tareas y planificación del proyecto. |

---

## 6. Conclusión
StudySync representa la convergencia de la productividad y la educación en una única herramienta. Al integrar el poder del algoritmo SRS con la motivación de la gamificación, buscamos redefinir la forma en que los estudiantes se organizan y estudian.

---

## 7. Contribuciones, Agradecimientos y Referencias
* **Agradecimientos:** A los creadores de Anki, Forest, MyStudyLife, Notion y Todoist por la inspiración.
* **Referencias de Investigación:** Zapier, Medium, Statista, AppMagic.

---

## 8. Licencia
Este proyecto se distribuye bajo la Licencia ** Aun no elegida**.

---

## 9. Contacto
* **Nombre:** Antonio Jesús Orellana Orea 
* **Correo Electrónico:** antoniojesusorellanaorea@gmail.com
