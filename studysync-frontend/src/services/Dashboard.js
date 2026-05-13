const [pregunta, setPregunta] = useState("");
const [respuesta, setRespuesta] = useState("");
const [cargando, setCargando] = useState(false);

const enviarDuda = async () => {
    setCargando(true);
    const res = await fetch("http://localhost:8080/api/dashboard/duda-rapida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta: pregunta })
    });
    const data = await res.json();
    setRespuesta(data.respuesta);
    setCargando(false);
};