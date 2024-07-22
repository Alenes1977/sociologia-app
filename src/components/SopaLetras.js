import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { temasData } from '../dataTemas';

const SopaLetras = ({ temaId, onVolver }) => {
  const [palabras, setPalabras] = useState([]);
  const [pistas, setPistas] = useState([]);
  const [grid, setGrid] = useState([]);
  const [encontradas, setEncontradas] = useState([]);
  const [completado, setCompletado] = useState(false);
  const [seleccion, setSeleccion] = useState({ inicio: null, fin: null });
  const [seleccionActual, setSeleccionActual] = useState([]);
  const [pistasVisibles, setPistasVisibles] = useState({});
  const [celdasEncontradas, setCeldasEncontradas] = useState([]);

  const generarSopaDeLetras = useCallback((palabrasData) => {
    const size = 15;
    let grid = Array(size).fill().map(() => Array(size).fill(''));
    
    palabrasData.forEach(({ palabra }) => {
      let colocada = false;
      let intentos = 0;
      while (!colocada && intentos < 100) {
        const direccion = Math.floor(Math.random() * 8); // 8 direcciones posibles
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);

        if (puedoColocarPalabra(grid, palabra, x, y, direccion)) {
          colocarPalabra(grid, palabra, x, y, direccion);
          colocada = true;
        }
        intentos++;
      }
    });

    // Rellenar espacios vacíos con letras aleatorias
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === '') {
          grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    return grid;
  }, []);

  const puedoColocarPalabra = (grid, palabra, x, y, direccion) => {
    const size = grid.length;
    const [dx, dy] = [
      [1, 0], [0, 1], [1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1], [-1, 1]
    ][direccion];

    if (x + dx * (palabra.length - 1) >= size || x + dx * (palabra.length - 1) < 0 ||
        y + dy * (palabra.length - 1) >= size || y + dy * (palabra.length - 1) < 0) return false;

    for (let i = 0; i < palabra.length; i++) {
      if (grid[x + dx * i][y + dy * i] !== '' && grid[x + dx * i][y + dy * i] !== palabra[i]) {
        return false;
      }
    }

    return true;
  };

  const colocarPalabra = (grid, palabra, x, y, direccion) => {
    const [dx, dy] = [
      [1, 0], [0, 1], [1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1], [-1, 1]
    ][direccion];
    for (let i = 0; i < palabra.length; i++) {
      grid[x + dx * i][y + dy * i] = palabra[i];
    }
  };

  useEffect(() => {
    const temaData = temasData[temaId];
    if (temaData && temaData.crucigrama && temaData.crucigrama.palabras) {
      const palabrasData = temaData.crucigrama.palabras.slice(0, 5); // Limitamos a 5 palabras
      setPalabras(palabrasData.map(p => p.palabra));
      setPistas(palabrasData);
      setGrid(generarSopaDeLetras(palabrasData));
      setPistasVisibles({});
      setEncontradas([]);
      setCompletado(false);
      setCeldasEncontradas([]);
    }
  }, [temaId, generarSopaDeLetras]);

  const handleMouseDown = (x, y) => {
    setSeleccion({ inicio: { x, y }, fin: { x, y } });
    setSeleccionActual([`${x},${y}`]);
  };

  const handleMouseEnter = (x, y) => {
    if (seleccion.inicio) {
      setSeleccion({ ...seleccion, fin: { x, y } });
      actualizarSeleccionActual({ x, y });
    }
  };

  const handleMouseUp = () => {
    const palabraSeleccionada = obtenerPalabraSeleccionada();
    if (palabraSeleccionada && palabras.includes(palabraSeleccionada) && !encontradas.includes(palabraSeleccionada)) {
      const nuevasEncontradas = [...encontradas, palabraSeleccionada];
      setEncontradas(nuevasEncontradas);
      setCeldasEncontradas([...celdasEncontradas, ...seleccionActual]);
      if (nuevasEncontradas.length === palabras.length) {
        setCompletado(true);
      }
    }
    setSeleccion({ inicio: null, fin: null });
    setSeleccionActual([]);
  };

  const actualizarSeleccionActual = (fin) => {
    const { inicio } = seleccion;
    const nuevaSeleccion = [];
    const dx = Math.sign(fin.x - inicio.x);
    const dy = Math.sign(fin.y - inicio.y);
    let x = inicio.x;
    let y = inicio.y;
    while (x !== fin.x + dx || y !== fin.y + dy) {
      nuevaSeleccion.push(`${x},${y}`);
      x += dx;
      y += dy;
      if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) break;
    }
    setSeleccionActual(nuevaSeleccion);
  };

  const obtenerPalabraSeleccionada = () => {
    return seleccionActual.map(coord => {
      const [x, y] = coord.split(',').map(Number);
      return grid[x][y];
    }).join('');
  };

  const mostrarPista = (index) => {
    setPistasVisibles(prev => ({...prev, [index]: true}));
  };

  const formatearPista = (palabra) => {
    return `${palabra[0]}${'-'.repeat(palabra.length - 2)}${palabra[palabra.length - 1]}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-sociologia-700">
          Sopa de Letras: {temasData[temaId].titulo}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {completado ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">¡Felicidades! Has completado la Sopa de Letras</h2>
            <Button onClick={() => {
              setCompletado(false);
              setEncontradas([]);
              setGrid(generarSopaDeLetras(pistas));
              setPistasVisibles({});
              setCeldasEncontradas([]);
            }} className="mr-2 bg-sociologia-600 hover:bg-sociologia-700 text-white">
              Jugar de nuevo
            </Button>
            <Button onClick={onVolver} className="bg-sociologia-600 hover:bg-sociologia-700 text-white">
              Volver a las actividades
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Palabras a encontrar:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {pistas.map(({ pista, palabra }, index) => (
                  <div key={index} className={`px-2 py-1 rounded ${
                    encontradas.includes(palabra) ? 'bg-green-200 text-green-800' : 'bg-sociologia-100 text-sociologia-700'
                  }`}>
                    {index + 1}. {pista} ({palabra.length} letras)
                    {encontradas.includes(palabra) ? (
                      <span className="ml-2 font-bold">{palabra}</span>
                    ) : (
                      <>
                        <Button 
                          onClick={() => mostrarPista(index)} 
                          className="ml-2 px-2 py-1 text-xs bg-sociologia-500 hover:bg-sociologia-600 text-white"
                        >
                          Pista
                        </Button>
                        {pistasVisibles[index] && (
                          <span className="ml-2">{formatearPista(palabra)}</span>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div 
              className="grid grid-cols-15 gap-1 w-full max-w-[600px] mx-auto"
              onMouseLeave={handleMouseUp}
            >
              {grid.map((row, x) => 
                row.map((cell, y) => (
                  <button
                    key={`${x},${y}`}
                    className={`w-8 h-8 text-center font-bold text-xs sm:text-sm md:text-base
                      ${celdasEncontradas.includes(`${x},${y}`) ? 'bg-green-200' :
                        seleccionActual.includes(`${x},${y}`) ? 'bg-yellow-200' : 'bg-white'}
                      border border-gray-300 rounded`}
                    onMouseDown={() => handleMouseDown(x, y)}
                    onMouseEnter={() => handleMouseEnter(x, y)}
                    onMouseUp={handleMouseUp}
                  >
                    {cell}
                  </button>
                ))
              )}
            </div>
            <Button onClick={onVolver} className="mt-4 bg-sociologia-600 hover:bg-sociologia-700 text-white">
              Volver a las actividades
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SopaLetras;