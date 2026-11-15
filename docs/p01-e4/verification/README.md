# Procedimiento E4 efectivamente ejecutado

Estos scripts operacionales se conservan con sus bytes ejecutados. No forman parte del motor científico ni cambian sus algoritmos. Las rutas absolutas son referencias históricas del workspace; no son URLs públicas ni se deben ejecutar ciegamente en un checkout de publicación.

El orquestador se ejecutó con `python /tmp/p01-e4-operation.py` desde /workspace/yellow, en HEAD limpio 6fcc698681514a90e1dcd28a0f926967b2304884. Se conservaron el plan publicado y su SHA-256 antes de cambiar de checkout. Los destinos restored/e4 eran inexistentes. El script usa creación exclusiva y no reanuda ni sustituye evidencia.

Los comandos exactos, tiempos UTC, códigos de salida y script stdin están en commands.jsonl. Secuencia: gate-before; integridad de solo lectura; copy-before; restore; restored-verify; independent-metrics; independent-descriptors; controller-recount; restored-replay (node por stdin, bloque idéntico al plan); gate-after; copy-after; restored-after. **12/12 salidas 0**. No se ejecutó cli.cjs run ni un agente.

El recuento independiente de descriptores importa solo el codec; el recálculo del controlador importa measure en un proceso separado. No se cambian descriptores históricos para hacerlos coincidir. El replay ejecuta el verificador existente con perfil final explícito, sobre los archivos restaurados.

Los scripts escriben únicamente resultados nuevos fuera del repositorio; requieren los originales para comprobación y no son una nueva API pública. Para reproducir E4 de nuevo deben elegirse salidas exclusivas y autorización operacional, conservando la primera evidencia, sin repetir E3.
