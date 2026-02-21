import csv
import io


class DocumentService:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def read_file(self, file_bytes: bytes, filename: str) -> str:
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

        if ext == "txt":
            return file_bytes.decode("utf-8")
        elif ext == "pdf":
            return self._read_pdf(file_bytes)
        elif ext == "csv":
            return self._read_csv(file_bytes)
        else:
            raise ValueError(f"Unsupported file type: .{ext}")

    def _read_pdf(self, file_bytes: bytes) -> str:
        import pdfplumber

        text_parts = []
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
        return "\n\n".join(text_parts)

    def _read_csv(self, file_bytes: bytes) -> str:
        text = file_bytes.decode("utf-8")
        reader = csv.reader(io.StringIO(text))
        rows = []
        for row in reader:
            rows.append(" | ".join(row))
        return "\n".join(rows)

    def chunk_text(self, text: str) -> list[str]:
        paragraphs = text.split("\n\n")
        chunks = []
        current_chunk = ""

        for para in paragraphs:
            para = para.strip()
            if not para:
                continue

            if len(current_chunk) + len(para) + 2 > self.chunk_size:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                # If a single paragraph is larger than chunk_size, split it further
                if len(para) > self.chunk_size:
                    words = para.split()
                    current_chunk = ""
                    for word in words:
                        if len(current_chunk) + len(word) + 1 > self.chunk_size:
                            if current_chunk:
                                chunks.append(current_chunk.strip())
                            current_chunk = word
                        else:
                            current_chunk = f"{current_chunk} {word}" if current_chunk else word
                else:
                    current_chunk = para
            else:
                current_chunk = f"{current_chunk}\n\n{para}" if current_chunk else para

        if current_chunk.strip():
            chunks.append(current_chunk.strip())

        return chunks
