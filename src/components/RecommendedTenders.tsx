'use client';

import Link from 'next/link';

interface Licitacion {
    id: string;
    expediente: string;
    titulo: string;
    organo_contratacion: string;
    tipo_contrato: string;
    presupuesto_base: number | null;
    fecha_publicacion: string;
    url_publicacion: string;
}

interface TenderCardProps {
    tender: Licitacion;
    featured?: boolean;
}

function formatBudget(amount: number | null): string {
    if (!amount) return 'No especificado';
    if (amount >= 1000000) {
        return `€${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
        return `€${(amount / 1000).toFixed(0)}k`;
    }
    return `€${amount.toLocaleString('es-ES')}`;
}

function getContractIcon(tipo: string): string {
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('obra')) return 'construction';
    if (tipoLower.includes('servicio')) return 'miscellaneous_services';
    if (tipoLower.includes('suministro')) return 'inventory_2';
    return 'description';
}

function getContractColor(tipo: string): { bg: string; text: string } {
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('obra')) return { bg: 'bg-orange-900/20', text: 'text-orange-400' };
    if (tipoLower.includes('servicio')) return { bg: 'bg-indigo-900/20', text: 'text-indigo-400' };
    if (tipoLower.includes('suministro')) return { bg: 'bg-emerald-900/20', text: 'text-emerald-400' };
    return { bg: 'bg-gray-800', text: 'text-gray-400' };
}

export function TenderCard({ tender, featured = false }: TenderCardProps) {
    const colors = getContractColor(tender.tipo_contrato);

    if (featured) {
        return (
            <div className="relative w-full rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#137fec] via-blue-700 to-purple-800"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                {/* Content */}
                <div className="relative p-6 md:p-8 flex flex-col justify-end h-[320px] md:h-[300px]">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex gap-2 mb-2">
                                <span className="px-2 py-1 rounded bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                                    {tender.tipo_contrato}
                                </span>
                                <span className="px-2 py-1 rounded bg-emerald-500/80 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                                    Match Alto
                                </span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight line-clamp-2">
                                {tender.titulo}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-gray-200 text-sm md:text-base">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">monetization_on</span>
                                    {formatBudget(tender.presupuesto_base)}
                                </span>
                                <span className="hidden md:block w-1 h-1 rounded-full bg-gray-400"></span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">apartment</span>
                                    {tender.organo_contratacion.substring(0, 30)}...
                                </span>
                            </div>
                        </div>
                        <Link
                            href={`/licitacion/${tender.id}`}
                            className="shrink-0 h-12 px-6 bg-[#137fec] hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            Ver Detalles
                            <span className="material-symbols-outlined text-sm">arrow_outward</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#1a2632] rounded-xl border border-[#2b3b4c] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full group">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <div className={`size-10 rounded-lg ${colors.bg} flex items-center justify-center ${colors.text}`}>
                        <span className="material-symbols-outlined">{getContractIcon(tender.tipo_contrato)}</span>
                    </div>
                    <span className="bg-[#101922] text-[#94a3b8] text-xs px-2 py-1 rounded border border-[#2b3b4c]">
                        {tender.tipo_contrato}
                    </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#137fec] transition-colors line-clamp-2">
                    {tender.titulo}
                </h4>
                <p className="text-[#94a3b8] text-sm line-clamp-2 mb-4">
                    {tender.organo_contratacion}
                </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#2b3b4c] mt-2">
                <span className="text-sm font-semibold text-white">{formatBudget(tender.presupuesto_base)}</span>
                <Link
                    href={`/licitacion/${tender.id}`}
                    className="text-xs text-[#137fec] hover:underline font-medium"
                >
                    Ver detalles →
                </Link>
            </div>
        </div>
    );
}

interface RecommendedTendersProps {
    tenders: Licitacion[];
}

export default function RecommendedTenders({ tenders }: RecommendedTendersProps) {
    if (!tenders || tenders.length === 0) return null;

    const [featured, ...rest] = tenders;
    const secondary = rest.slice(0, 2);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Recomendadas para Ti</h2>
                <Link
                    href="/search"
                    className="text-sm font-semibold text-[#137fec] hover:text-blue-400 flex items-center gap-1"
                >
                    Ver todas <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
            </div>

            {/* Hero Card */}
            {featured && <TenderCard tender={featured} featured />}

            {/* Secondary Cards Grid */}
            {secondary.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {secondary.map((tender) => (
                        <TenderCard key={tender.id} tender={tender} />
                    ))}
                </div>
            )}
        </div>
    );
}
