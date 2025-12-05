import { themes, MenuTheme } from "@/lib/menu-themes";

interface MenuPreviewProps {
  theme: MenuTheme;
  restaurantName: string;
  logoUrl: string | null;
  introText: string;
}

const MenuPreview = ({ theme, restaurantName, logoUrl, introText }: MenuPreviewProps) => {
  const themeConfig = themes[theme];

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
        <div className="p-4 space-y-4">
          {sampleCategories.map((category) => (
            <div key={category.name}>
              <h3 className={`text-sm font-semibold ${themeConfig.accentColor} ${themeConfig.titleFont} mb-2`}>
                {category.name}
              </h3>
              <div className="space-y-2">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className={`${themeConfig.cardBg} ${themeConfig.borderStyle} rounded p-2`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${themeConfig.accentColor} ${themeConfig.bodyFont}`}>
                          {item.name}
                        </p>
                        <p className={`text-xs text-muted-foreground ${themeConfig.bodyFont} truncate`}>
                          {item.description}
                        </p>
                      </div>
                      {item.price && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${themeConfig.priceStyle}`}>
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
