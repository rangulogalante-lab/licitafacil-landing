'use client'

import { useState, useRef } from 'react'

const folders = [
    { id: '1', name: 'Certificaciones', icon: 'workspace_premium', count: 12, color: 'text-amber-400' },
    { id: '2', name: 'Experiencia Previa', icon: 'work_history', count: 8, color: 'text-emerald-400' },
    { id: '3', name: 'Equipo Técnico', icon: 'group', count: 5, color: 'text-blue-400' },
    { id: '4', name: 'Documentación Legal', icon: 'gavel', count: 15, color: 'text-purple-400' },
    { id: '5', name: 'Seguros y Avales', icon: 'shield', count: 3, color: 'text-red-400' },
    { id: '6', name: 'Plantillas', icon: 'draft', count: 7, color: 'text-cyan-400' },
]

const recentDocs = [
    { id: '1', name: 'Certificado ISO 9001:2015.pdf', folder: 'Certificaciones', date: '05/02/2026', size: '2.1 MB' },
    { id: '2', name: 'CV_Director_Técnico.pdf', folder: 'Equipo Técnico', date: '03/02/2026', size: '1.4 MB' },
    { id: '3', name: 'Poliza_RC_2026.pdf', folder: 'Seguros y Avales', date: '01/02/2026', size: '3.2 MB' },
    { id: '4', name: 'Escritura_Constitución.pdf', folder: 'Documentación Legal', date: '28/01/2026', size: '5.7 MB' },
    { id: '5', name: 'Contrato_Ayto_Madrid_2025.pdf', folder: 'Experiencia Previa', date: '25/01/2026', size: '890 KB' },
]

export default function DocumentsPage() {
    const [dragOver, setDragOver] = useState(false)
    const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const files = Array.from(e.dataTransfer.files)
        simulateUpload(files)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        simulateUpload(files)
    }

    const simulateUpload = (files: File[]) => {
        const newFiles = files.map(f => ({ name: f.name, progress: 0 }))
        setUploadingFiles(prev => [...prev, ...newFiles])

        newFiles.forEach((file, idx) => {
            const interval = setInterval(() => {
                setUploadingFiles(prev =>
                    prev.map(f =>
                        f.name === file.name ? { ...f, progress: Math.min(f.progress + 15 + Math.random() * 20, 100) } : f
                    )
                )
            }, 300)

            setTimeout(() => {
                clearInterval(interval)
                setUploadingFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress: 100 } : f))
                setTimeout(() => {
                    setUploadingFiles(prev => prev.filter(f => f.name !== file.name))
                }, 1500 + idx * 200)
            }, 2000 + idx * 500)
        })
    }

    return (
        <div className="flex flex-col xl:flex-row h-full">
            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Gestor de Documentos</h1>
                        <p className="text-[#94a3b8] text-sm mt-1">Tu repositorio corporativo centralizado</p>
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 bg-[#137fec] hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">upload_file</span>
                        Subir Archivo
                    </button>
                    <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
                </div>

                {/* Folder Grid */}
                <div>
                    <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">Carpetas</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {folders.map((folder) => (
                            <button
                                key={folder.id}
                                className="bg-[#1a2632] rounded-xl border border-[#2b3b4c] p-4 hover:border-[#137fec]/40 transition-all text-left group"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`material-symbols-outlined ${folder.color} text-2xl`}>{folder.icon}</span>
                                </div>
                                <h3 className="text-white text-sm font-medium group-hover:text-[#137fec] transition-colors">{folder.name}</h3>
                                <p className="text-[#64748b] text-xs mt-1">{folder.count} archivos</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Documents */}
                <div>
                    <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">Documentos Recientes</h2>
                    <div className="bg-[#1a2632] rounded-xl border border-[#2b3b4c] overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#2b3b4c]">
                                    <th className="text-left text-[#64748b] font-medium px-4 py-3 text-xs uppercase">Nombre</th>
                                    <th className="text-left text-[#64748b] font-medium px-4 py-3 text-xs uppercase hidden md:table-cell">Carpeta</th>
                                    <th className="text-left text-[#64748b] font-medium px-4 py-3 text-xs uppercase hidden sm:table-cell">Fecha</th>
                                    <th className="text-left text-[#64748b] font-medium px-4 py-3 text-xs uppercase">Tamaño</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentDocs.map((doc) => (
                                    <tr key={doc.id} className="border-b border-[#2b3b4c]/50 hover:bg-[#0f1920] transition-colors cursor-pointer">
                                        <td className="px-4 py-3 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-red-400 text-lg">picture_as_pdf</span>
                                            <span className="text-white">{doc.name}</span>
                                        </td>
                                        <td className="px-4 py-3 text-[#94a3b8] hidden md:table-cell">{doc.folder}</td>
                                        <td className="px-4 py-3 text-[#94a3b8] hidden sm:table-cell">{doc.date}</td>
                                        <td className="px-4 py-3 text-[#94a3b8]">{doc.size}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Sidebar — Upload Zone & AI */}
            <aside className="w-full xl:w-80 border-t xl:border-t-0 xl:border-l border-[#2b3b4c] bg-[#0f1920] p-5 space-y-5 overflow-y-auto shrink-0">
                {/* Drag & Drop Upload */}
                <div>
                    <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">Subir Documentos</h3>
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${dragOver ? 'border-[#137fec] bg-[#137fec]/5' : 'border-[#2b3b4c] hover:border-[#94a3b8]'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-3xl mb-2 ${dragOver ? 'text-[#137fec]' : 'text-[#2b3b4c]'}`}>cloud_upload</span>
                        <p className="text-[#94a3b8] text-xs">Arrastra archivos aquí o <span className="text-[#137fec]">selecciona</span></p>
                        <p className="text-[#64748b] text-[10px] mt-1">PDF, DOC, XLS hasta 50MB</p>
                    </div>
                </div>

                {/* Upload Progress */}
                {uploadingFiles.length > 0 && (
                    <div className="space-y-2">
                        {uploadingFiles.map((file, i) => (
                            <div key={i} className="bg-[#1a2632] rounded-lg p-3 border border-[#2b3b4c]">
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="text-white truncate mr-2">{file.name}</span>
                                    <span className="text-[#94a3b8]">{Math.round(file.progress)}%</span>
                                </div>
                                <div className="w-full bg-[#0f1920] rounded-full h-1.5">
                                    <div className="h-1.5 rounded-full bg-[#137fec] transition-all" style={{ width: `${file.progress}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* AI Insight */}
                <div className="bg-gradient-to-br from-amber-900/20 to-amber-900/5 rounded-xl border border-amber-700/30 p-4">
                    <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-amber-400 text-lg">warning</span>
                        <div>
                            <h4 className="text-amber-400 text-xs font-semibold">Alerta IA</h4>
                            <p className="text-[#94a3b8] text-xs mt-1">Tu póliza de seguro de RC vence el <span className="text-white font-medium">15/03/2026</span>. Actualízala para mantener vigente tu solvencia.</p>
                        </div>
                    </div>
                </div>

                {/* Repository Summary */}
                <div className="bg-[#1a2632] rounded-xl border border-[#2b3b4c] p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider">Estado del Repositorio</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                            <p className="text-xl font-bold text-white">50</p>
                            <p className="text-[#64748b] text-xs">Archivos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-white">6</p>
                            <p className="text-[#64748b] text-xs">Carpetas</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-emerald-400">48</p>
                            <p className="text-[#64748b] text-xs">Vigentes</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-amber-400">2</p>
                            <p className="text-[#64748b] text-xs">Por renovar</p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    )
}
