//https://github.com/root-cause/ragemp-hair-overlays/blob/master/client_packages/hair-overlay/index.js#L56

(() => {
  const REPLACE_PATTERN = /\u0000/g;
  const freemodeMaleModel = GetHashKey("mp_m_freemode_01");
  const freemodeFemaleModel = GetHashKey("mp_f_freemode_01");
  const mpModels = [freemodeFemaleModel, freemodeMaleModel];
  const freemodeMaleOverlays = new Map(); // preset hash -> collection hash
  const freemodeFemaleOverlays = new Map(); // preset hash -> collection hash
  const hairOverlayCache = new Map(); // hair component hash -> { collection, preset }
  const charFreemodeMale = 3;
  const charFreemodeFemale = 4;
  const hairComponentIndex = 2;
  const defaultCollection = GetHashKey("mpbeach_overlays");
  const defaultPreset = GetHashKey("fm_hair_fuzz");
  const decalComponentIndex = 10;
  const JENKINS_ZERO = GetHashKey("0");

  function getString(buffer, offset, length = 64) {
    return String.fromCharCode
      .apply(null, new Uint8Array(buffer, offset, length))
      .replace(REPLACE_PATTERN, "");
  }

  function getTattooCollectionData(characterType, decorationIndex) {
    const buffer = new Uint32Array(new ArrayBuffer(120));

    if (
      !Citizen.invokeNative(
        "0xFF56381874F82086",
        characterType,
        decorationIndex,
        buffer
      )
    ) {
      return;
    }

    const {
      0: lockHash,
      2: id,
      4: collection,
      6: preset,
      8: cost,
      10: eFacing,
      12: updateGroup,
    } = buffer;

    return {
      lockHash,
      id,
      collection,
      preset,
      cost,
      eFacing,
      updateGroup,
      textLabel: getString(buffer, 56),
    };
  }

  const hairOverlay = GetHashKey("hairOverlay");

  function fillTattooMap(map, characterIndex) {
    for (
      let i = 0, max = GetNumTattooShopDlcItems(characterIndex);
      i < max;
      i++
    ) {
      const { preset, collection, updateGroup } =
        getTattooCollectionData(characterIndex, i) || {};

      if (updateGroup !== hairOverlay) {
        continue;
      }

      map.set(preset >> 0, collection >> 0);
    }
  }

  function findHairOverlay(hairHash, characterIndex) {
    if (hairOverlayCache.has(hairHash)) {
      return hairOverlayCache.get(hairHash);
    }

    let outHairOverlay = {
      collection: defaultCollection,
      preset: defaultPreset,
    };

    for (
      let i = 0, max = GetShopPedApparelForcedComponentCount(hairHash);
      i < max;
      i++
    ) {
      const [nameHash, enumValue, componentType] = GetForcedComponent(
        hairHash,
        i
      );

      if (
        componentType !== decalComponentIndex ||
        nameHash === -1 ||
        nameHash === 0 ||
        nameHash === JENKINS_ZERO
      ) {
        continue;
      }

      const overlay = (
        characterIndex === charFreemodeMale
          ? freemodeMaleOverlays
          : freemodeFemaleOverlays
      ).get(nameHash);
      if (overlay) {
        outHairOverlay = {
          collection: overlay,
          preset: nameHash,
        };

        break;
      }
    }

    hairOverlayCache.set(hairHash, outHairOverlay);
    return outHairOverlay;
  }

  fillTattooMap(freemodeMaleOverlays, charFreemodeMale);
  fillTattooMap(freemodeFemaleOverlays, charFreemodeFemale);

  function applyHairOverlayToEntity(entity, hairIndex) {
    if (!entity) {
      return;
    }

    const entityModel = GetEntityModel(entity);

    if (!mpModels.includes(entityModel)) {
      return;
    }

    const hairHash = GetHashNameForComponent(
      entity,
      hairComponentIndex,
      hairIndex,
      0
    );

    const { collection, preset } = findHairOverlay(
      hairHash,
      entityModel === freemodeMaleModel ? charFreemodeMale : charFreemodeFemale
    );

    ClearPedDecorationsLeaveScars(entity);
    AddPedDecorationFromHashesInCorona(entity, collection, preset);
  }

  global.exports("applyHeadOverlay", (ped) => {
    applyHairOverlayToEntity(ped, GetPedDrawableVariation(ped, 2));
  });
})();
