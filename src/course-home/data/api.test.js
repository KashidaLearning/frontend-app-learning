import { getTimeOffsetMillis, normalizeOutlineBlocks } from './api';

describe('Calculate the time offset properly', () => {
  it('Should return 0 if the headerDate is not set', async () => {
    const offset = getTimeOffsetMillis(undefined, undefined, undefined);
    expect(offset).toBe(0);
  });

  it('Should return the offset', async () => {
    const headerDate = '2021-04-13T11:01:58.135Z';
    const requestTime = new Date('2021-04-12T11:01:57.135Z');
    const responseTime = new Date('2021-04-12T11:01:58.635Z');
    const offset = getTimeOffsetMillis(headerDate, requestTime, responseTime);
    expect(offset).toBe(86398750);
  });
});

describe('normalizeOutlineBlocks', () => {
  const courseId = 'course-v1:edX+DemoX+Demo_Course';

  it('normalizes course/chapter/sequential blocks unchanged when no verticals are present', () => {
    const blocks = {
      course_block: {
        id: 'course_block', type: 'course', display_name: 'Demo Course', children: ['chapter_block'],
      },
      chapter_block: {
        id: 'chapter_block', type: 'chapter', display_name: 'Chapter 1', children: ['sequential_block'],
      },
      sequential_block: {
        id: 'sequential_block', type: 'sequential', display_name: 'Subsection 1', children: [],
      },
    };

    const models = normalizeOutlineBlocks(courseId, blocks);

    expect(models.sections.chapter_block.sequenceIds).toEqual(['sequential_block']);
    expect(models.sequences.sequential_block.title).toBe('Subsection 1');
    expect(models.sequences.sequential_block.unitIds).toEqual([]);
    expect(models.units).toEqual({});
  });

  it('normalizes vertical blocks into models.units and links them back to their sequence', () => {
    const blocks = {
      course_block: {
        id: 'course_block', type: 'course', display_name: 'Demo Course', children: ['chapter_block'],
      },
      chapter_block: {
        id: 'chapter_block', type: 'chapter', display_name: 'Chapter 1', children: ['sequential_block'],
      },
      sequential_block: {
        id: 'sequential_block', type: 'sequential', display_name: 'Subsection 1', children: ['vertical_block'],
      },
      vertical_block: {
        id: 'vertical_block',
        type: 'vertical',
        display_name: 'Unit 1',
        complete: true,
        image_for_unit: '/asset-v1:foo+bar+baz+type@asset+block@unit.png',
        image_for_unit_icon: '/asset-v1:foo+bar+baz+type@asset+block@icon.png',
        duration_for_unit: '5 mins',
        top_icon_for_unit: '/asset-v1:foo+bar+baz+type@asset+block@nav.png',
      },
    };

    const models = normalizeOutlineBlocks(courseId, blocks);

    expect(models.sequences.sequential_block.unitIds).toEqual(['vertical_block']);
    expect(models.units.vertical_block).toEqual({
      id: 'vertical_block',
      complete: true,
      title: 'Unit 1',
      imageForUnit: '/asset-v1:foo+bar+baz+type@asset+block@unit.png',
      imageForUnitIcon: '/asset-v1:foo+bar+baz+type@asset+block@icon.png',
      durationForUnit: '5 mins',
      topIconForUnit: '/asset-v1:foo+bar+baz+type@asset+block@nav.png',
      sequenceId: 'sequential_block',
    });
  });
});
