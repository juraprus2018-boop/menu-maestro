import { getTheme } from "@/lib/menu-themes";

interface MenuPreviewProps {
  theme: string | null | undefined;
  restaurantName: string;
  logoUrl: string | null;
  introText: string;
}

const MenuPreview = ({ theme, restaurantName, logoUrl, introText }: MenuPreviewProps) => {
  const themeConfig = getTheme(theme);

  // Sample preview data
  const sampleCategories = [
    {
      name: "Voorgerechten",
      items: [
        { name: "Tomatensoep", description: "Met verse basilicum", price: 8.50 },
        { name: "Carpaccio", description: "Runderhaas met parmezaan", price: 14.50 },
      ],
    },
    {
      name: "Hoofdgerechten",
      items: [
        { name: "Biefstuk", description: "Met friet en salade", price: 24.50 },
        { name: "Zalm", description: "Met seizoensgroenten", price: null },
      ],
    },
  ];

  return (
    <div className="border border-border rounded-lg overflow-hidden shadow-lg">
      <div className="text-xs text-muted-foreground bg-muted px-3 py-1 text-center">
        Live preview
      </div>
      <div className={`${themeConfig.bodyBg} min-h-[400px]`}>
        {/* Header */}
        <div className={`${themeConfig.headerBg} ${themeConfig.headerText} p-4 text-center`}>
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className="w-16 h-16 mx-auto rounded-full object-cover mb-2 border-2 border-white/20"
            />
          )}
          <h2 className={`text-lg font-bold ${themeConfig.titleFont}`}>
            {restaurantName || "Restaurant naam"}
          </h2>
          {introText && (
            <p className={`text-sm mt-1 opacity-90 ${themeConfig.bodyFont}`}>
              {introText.length > 60 ? introText.substring(0, 60) + "..." : introText}
            </p>
          )}
        </div>

        {/* Menu content */}
        <div className="p-4 space-y-6">
          {sampleCategories.map((category) => (
            <div key={category.name}>
              <h3 className={`text-sm mb-3 ${themeConfig.categoryStyle}`}>
                {category.name}
              </h3>
              <div>
                {category.items.map((item, index) => (
                  <div
                    key={item.name}
                    className={`${themeConfig.itemSpacing} ${index > 0 ? themeConfig.borderStyle : ''}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${themeConfig.accentColor}`}>
                          {item.name}
                        </p>
                        <p className={`text-xs ${themeConfig.bodyFont} truncate`}>
                          {item.description}
                        </p>
                      </div>
                      {item.price && (
                        <span className={`text-xs ${themeConfig.priceStyle}`}>
                          €{item.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPreview;
