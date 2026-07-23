-- CreateTable
CREATE TABLE "Category" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconName" TEXT NOT NULL DEFAULT 'HelpCircle',
    "color" TEXT NOT NULL DEFAULT 'bg-blue-50/70',
    "textColor" TEXT NOT NULL DEFAULT 'text-blue-600',
    "borderColor" TEXT NOT NULL DEFAULT 'border-blue-100',
    "count" TEXT NOT NULL DEFAULT '0 cursos',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("slug")
);
