# StudySync-DAM
# ⚡ StudySync: Tu Centro de Control Académico Todo en Uno

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
* [7. Agradecimientos y Referencias](#7-agradecimientos-y-referencias)
    * [7.1. Agradecimientos](#71-agradecimientos)
    * [7.2. Referencias](#72-referencias)
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
* Integrar un sistema de estudio con temporizador (Tipo Pomodoro) para fomentar la concentración.
* Implementar un sistema de **Tarjetas de Repaso (Flashcards)** basado en el algoritmo de Repetición Espaciada (SRS).
* Ofrecer una interfaz **limpia y minimalista** con un *onboarding* rápido.
* Sincronización Total: Gestión en tiempo real de tareas, eventos de calendario y materiales de estudio.
### 1.4. Motivación
La principal motivación es crear una herramienta que hubiéramos deseado tener como estudiantes, facilitando la organización y mejorando la efectividad del estudio a través de la tecnología y el diseño centrado en el usuario.

---

## 2. Funcionalidades Clave y Tecnologías

### 2.1. Funcionalidades
* **Autenticación Personalizada:** Sistema de Login y Registro adaptado con validación de credenciales.
* **Agenda Inteligente:** Calendario dinámico para la gestión de exámenes, entregas y eventos académicos.
* **Concentración:** Temporizador Pomodoro integrado con estadísticas.
* **Flashcards (Tarjetas de Repaso):** Creación y gestión de mazos de cartas para optimizar la memorización de conceptos clave.
* **Estadísticas de Estudio:** Seguimiento del tiempo total, materias más estudiadas y racha de días seguidos.
* **Dashboard de Progreso:** Visualización clara del estado de las tareas y el rendimiento académico actual.
* **UX/Diseño:** Personalización de temas, animaciones de recompensa y diseño limpio.
* **Diseño Responsive:** Interfaz totalmente adaptada para dispositivos móviles y escritorio.

### 2.2. Tecnologías (Stack)
| Componente | Tecnología | Razón / Uso |
| :--- | :--- | :--- |
| **Frontend Móvil/Web** | **React.js** | Interfaz de usuario dinámica y SPA (Single Page Application). |
| **Estilos** | **Tailwind CSS** | Diseño moderno, utilitario y responsive. |
| **Backend** | **Spring Boot (Java)** |API RESTful, seguridad y lógica de negocio. |
| **Base de Datos** | **MySQL** | Persistencia de datos de usuarios, materias y flashcards. |
| **Diseño** | **Figma** | Prototipado y diseño de la interfaz minimalista. |
| **Iconografía** | **Lucide React** | Set de iconos minimalistas para una UX intuitiva. |
| **IA** | **Api Key Google AI Studio** | Integración para generación de tarjetas y respuestas de tutor automáticas. |

---

## 3. Guía de Instalación

1.  **Clonar el Repositorio:** `git clone https://github.com/AntonioJOrellana/StudySync-DAM.git`
2.  **Configurar el Backend (Spring Boot):**
    * Importar el proyecto en VScode/IntelliJ/Eclipse.
    * Configurar el application.properties con tus credenciales de MySQL.
    * Ejecutar StudySyncApplication.java.
3.  **Configurar el Frontend (React Native):**
    * Navegar a la carpeta del frontend: cd studysync-frontend
    * Instalar dependencias: npm install
    * Levantar la app: npm run dev

---

## 4. Guía de Uso

1.  **Registro/Login:** Crea una cuenta o inicia sesión para acceder a tu panel personal.
2.  **Organización:** Añade tus asignaturas actuales en la sección de materias para segmentar tu estudio.
3.  **Planificación:** Utiliza el calendario para registrar tus próximas entregas o exámenes.
4.  **Estudio Activo:** Crea mazos de Flashcards en la sección correspondiente para empezar a repasar tus temas más difíciles.
5.  **Control:** Revisa el Dashboard principal para tener una visión 360º de tus obligaciones diarias.

---

## 5. Documentación y Recursos

| Recurso | Enlace | Descripción |
| :--- | :--- | :--- |
| **Documentación Completa** | [Enlace a Documentación (Notion)](https://www.notion.so/StudySync-Tu-Centro-de-Control-Acad-mico-Todo-en-Uno-2bc80a1f1ef180ecaebff732098eab47?source=copy_link) | Contiene diagramas UML, ER, Casos de Prueba, y detalles de arquitectura. |
| **Prototipo de Interfaz (Figma)** | [Enlace a Figma](https://www.figma.com/design/HrPnBlJOuwqiIDTOLRdWBL/StudySync?node-id=0-1&t=6pIcprBjt1mqu764-1) | Wireframes, mockups y guía de estilos UX/UI. |
| **Kanban Board** | [Enlace al Kanban Board (Trello)](https://trello.com/invite/b/692d784e1b519e766e1a91de/ATTI0eac0c17c07ddb5d41598610c61522365576E534/proyecto) | Seguimiento de tareas y planificación del proyecto. |

---

## 6. Conclusión
StudySync representa la culminación de un proceso de aprendizaje intensivo en el desarrollo de aplicaciones multiplataforma. Más allá de ser un gestor académico, es la respuesta a una necesidad real de organización eficiente, combinando una arquitectura robusta en el backend con una experiencia de usuario moderna y fluida. Este proyecto sienta las bases para una herramienta escalable, capaz de adaptarse a las exigencias del entorno educativo actual mediante tecnología de vanguardia.

---

## 7. Agradecimientos y Referencias
   ## 7.1 Agradecimientos
   Este proyecto es el resultado de meses de trabajo, aprendizaje y perseverancia. No habría sido posible sin el apoyo de las personas que me rodean:
   * **mis padres**, Por ser mi base y mi apoyo constante. Gracias por creer siempre en mí, por darme las herramientas para llegar hasta aquí y por enseñarme que con           esfuerzo no hay meta inalcanzable. Este logro es tan vuestro como mío.
   * **rocío**, mi compañera de vida, gracias por tu paciencia infinita, por tus palabras de ánimo cuando el código no salía y por estar a mi lado en cada hora de estudio.     Gracias por ser mi refugio y mi mayor motivación; tu apoyo ha sido el motor que me ha impulsado a terminar este proyecto con éxito.
   * a mi **abuela**, en estos momentos no me olvido de ti viejita, aunque no pudieras verme crecer físicamente se que hayá donde estés estarás orgullosa de mi, por eso          este proyecto va dedicado en parte al cielo, para ella, porque siempre estará mas viva que nunca en mi corazón.
   * a mis **profesores**, por enseñarme durante estos años todos los conocimientos de la mejor manera posible.
   * y porqué no, a **mi mismo**, por no rendirme cuando las cosas se pusieron difíciles, por la curiosidad de seguir aprendiendo y por la disciplina de dedicarle cada hora    necesaria a este proyecto.
   
   ## 7.2 Referencias
   Para el desarrollo de StudySync, se han consultado diversas fuentes técnicas y metodologías de productividad que garantizan la eficacia de la herramienta:

*   Metodologías de Aprendizaje:

     * Repetición Espaciada (Spaced Repetition System - SRS): Estudio de los algoritmos de memorización para la implementación del sistema de Flashcards.
   
     * Técnica Pomodoro: Investigación sobre la gestión del tiempo y ciclos de concentración para el diseño del flujo de estudio.

  * Documentación Técnica:

     * Spring Boot Documentation: Referencia principal para la arquitectura del Backend y seguridad.
      
    * React.js Docs: Guía fundamental para la gestión del estado y componentes de la interfaz.
      
    * Tailwind CSS Documentation: Documentación utilizada para el diseño visual y adaptabilidad (Responsive).
      
    * Análisis de Mercado (Benchmarking)

  * Estudio de UX/UI basado en referentes del sector como Anki, Notion, Todoist y MyStudyLife para definir los estándares de usabilidad académica.

---

## 8. Licencia
Este proyecto se distribuye bajo la Licencia **MIT**.

---

## 9. Contacto
* **Autor:** Antonio Jesús Orellana Orea
* **LinkedIn:** www.linkedin.com/in/antonio-jesús-orellana-orea-88036836b
* **Correo Electrónico:** antoniojesusorellanaorea@gmail.com
