/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `style_presets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "style_presets_name_key" ON "style_presets"("name");
