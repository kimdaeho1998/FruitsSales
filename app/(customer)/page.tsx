import Link from "next/link";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
export default function Home() { return <><PagePlaceholder title="제철 과일을 가장 맛있을 때" description="복숭아와 곶감의 시즌을 중심으로, 필요한 정보를 간결하게 전하는 FruitsSales입니다."/><Link href="/products" className="mt-6 inline-block rounded-md bg-[var(--primary)] px-4 py-2 font-medium text-white">상품 살펴보기</Link></>; }
